import inspect
import logging
from enum import Enum
from typing import Any, Callable

class ServiceLifecycle(Enum):
    """Enumeration of service lifecycles to be used in the DIContainer"""
    SCOPED = 1
    TRANSIENT = 2
    SINGLETON = 3

class ContainerException(Exception):
    """Exception class for container related errors"""
    pass

class DIContainer:
    """Dependency Injection container class to register and resolve services"""
    _registry: dict[type, tuple[type | Callable[[], Any], ServiceLifecycle]] = {}
    _singleton_instances: dict[type, Any] = {}
    _scoped_instances: dict[str, dict[type, Any]] = {}
    _logger = logging.getLogger()
    _default_instance: "DIContainer"
        
    def register[TInterface, TImplementation](
            self,
            interface: type[TInterface],
            implementation: type[TImplementation],
            lifecycle: ServiceLifecycle = ServiceLifecycle.SCOPED) -> None:
        """
            Register a service with the container for the given interface.
        Args:
            interface (type[TInterface]): The interface type to register the service for
            implementation (type[TImplementation] | Callable[[], TImplementation]): The implementation type or factory function
            lifecycle (ServiceLifecycle): The lifecycle of the service
        """
        self._registry[interface] = (implementation, lifecycle)
        self._logger.debug(f"Registered service {interface} with implementation {implementation} and lifecycle {lifecycle}")

    def unregister[T](self, interface: type[T]) -> None:
        """Unregister a service from the container
        Args:
            interface (type[T]): The type of the service to unregister
        """
        if interface in self._registry:
            del self._registry[interface]
            self._logger.debug(f"Unregistered service {interface}")

    def resolve[T](self, service: type[T], scope_id: str | None = None) -> T:
        """Resolve the service instance for the given type
        Args:
            service (type[T]): The type of the service to resolve
            scope_id (str | None): The scope ID for the instance (only for scoped services)
        Returns:
            T: The resolved instance of the service
        """
        service_info = self._registry.get(service)

        if service_info is None:
            raise ContainerException(f"No implementation registered for the service {service}")

        implementation, lifecycle = service_info

        if lifecycle == ServiceLifecycle.SINGLETON:
            if service not in self._singleton_instances:
                self._singleton_instances[service] = self._create_instance(implementation, None)
            return self._singleton_instances[service]

        if lifecycle == ServiceLifecycle.SCOPED:
            if scope_id is None:
                raise ContainerException("Scoped lifecycle requires a scope_id")
            if scope_id not in self._scoped_instances:
                self._scoped_instances[scope_id] = {} # Create a new scope if it doesn't exist
            if service not in self._scoped_instances[scope_id]:
                self._scoped_instances[scope_id][service] = self._create_instance(implementation, scope_id)
            return self._scoped_instances[scope_id][service]
        
        # Transient lifecycle - create a new instance every time
        return self._create_instance(implementation, None)
    
    def start_scope(self, scope_id: str) -> None:
        """Start a new scope with the given ID"""
        if scope_id in self._scoped_instances:
            raise Exception("Scope already exists")
        self._scoped_instances[scope_id] = {}
        
    def end_scope(self, scope_id: str) -> None:
        """End the scope with the given ID"""
        # Retrieve and remove the scope in a single operation
        scope = self._scoped_instances.pop(scope_id, None)
        
        if scope:
            # Iterate over services in the scope and call __exit__ if available
            for service_instance in scope.values():
                exit_method = getattr(service_instance, "__exit__", None)
                if callable(exit_method):
                    exit_method(None, None, None)
    
    def _create_instance[T](self, implementation: type[T] | Callable[[], T], scope_id: str | None = None) -> T:
        """Create an instance of the given implementation type
        Args:
            implementation (type[T]): The type of the implementation to create an instance of
            scope_id (str | None): The scope ID for the instance (only for scoped services)
        Returns:
            T: The created instance
        """
        
        # Check if implementation is a callable (factory method) or a type (class)
        if inspect.isfunction(implementation) or inspect.ismethod(implementation):
            self._logger.debug(f"Creating instance of {implementation} with scope {scope_id}")
            return implementation()
        
        dependencies = self._get_dependencies(implementation, scope_id) # type: ignore
        if dependencies:
            self._logger.debug(f"Creating instance of {implementation} with scope {scope_id}, dependencies: {dependencies}")
            return implementation(**dependencies)
        else:
            self._logger.debug(f"Creating instance of {implementation} with scope {scope_id}")
            return implementation()
        
    def _get_dependencies[T](self, implementation: type[T], scope_id: str | None = None) -> dict[str, Any]:
        """Get dependencies for the given implementation type
        Args:
            implementation (type[T]): The type of the implementation to get dependencies for
            scope_id (str | None): The scope ID for the instance (only for scoped services)
        Returns:
            dict[str, Any]: The dictionary of dependencies for the implementation
        """
        constructor = inspect.signature(implementation.__init__)
        dependencies: dict[str, Any] = {}

        for name, param in constructor.parameters.items():
            if name == "self" or param.annotation == param.empty:
                continue
            dependencies[name] = self.resolve(param.annotation, scope_id)

        return dependencies
    
    @staticmethod
    def get_default() -> "DIContainer":
        """Get the default instance of the DI container"""
        if not hasattr(DIContainer, "_default_instance"):
            DIContainer._default_instance = DIContainer()
        return DIContainer._default_instance
    
    @staticmethod
    def register_service[T](lifecycle: ServiceLifecycle) -> Callable[[type[T]], type[T]]:
        """
            Decorator to register a class as a service in the default DI container
        Args:
            lifecycle (ServiceLifecycle): The lifecycle of the service
        Returns:
            Callable[[type[T]], type[T]]: Decorator function
        """
        def decorator(implementation_type: type[T]) -> type[T]:
            DIContainer.get_default().register(implementation_type, implementation_type, lifecycle)
            return implementation_type
        return decorator
    
    @staticmethod
    def register_singleton[T]() -> Callable[[type[T]], type[T]]:
        """
            Decorator to register a class as a service in the default DI container with singleton lifecycle
        Args:
            lifecycle (ServiceLifecycle): The lifecycle of the service
        Returns:
            Callable[[type[T]], type[T]]: Decorator function
        """
        return DIContainer.register_service(ServiceLifecycle.SINGLETON)
    
    @staticmethod
    def register_scoped[T]() -> Callable[[type[T]], type[T]]:
        """
            Decorator to register a class as a service in the default DI container with scoped lifecycle
        Args:
            lifecycle (ServiceLifecycle): The lifecycle of the service
        Returns:
            Callable[[type[T]], type[T]]: Decorator function
        """
        return DIContainer.register_service(ServiceLifecycle.SCOPED)
    
    @staticmethod
    def register_transient[T]() -> Callable[[type[T]], type[T]]:
        """
            Decorator to register a class as a service in the default DI container with transient lifecycle
        Args:
            lifecycle (ServiceLifecycle): The lifecycle of the service
        Returns:
            Callable[[type[T]], type[T]]: Decorator function
        """
        return DIContainer.register_service(ServiceLifecycle.TRANSIENT)
