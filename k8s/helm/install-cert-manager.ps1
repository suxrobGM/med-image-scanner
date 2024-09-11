$NAMESPACE="cert-manager"

# helm repo add jetstack https://charts.jetstack.io --force-update

helm install cert-manager jetstack/cert-manager `
    --namespace $NAMESPACE `
    --create-namespace `
    --set crds.enabled=true
