# server.py
import litserve as ls  # Import litserve library with alias ls
import ollama  # Import ollama library
from enums import DLModelEndpoint, DLModelWeights


# (STEP 1) - DEFINE THE API (compound AI system)
class LLMAPI(ls.LitAPI):
    def ask_ollama(self, prompt: str) -> str:
        """
        Sends a prompt to the Ollama model and retrieves the response.
        Returns the content of the response message.
        """
        print('prompt:', prompt)
        
        # Use completions instead of chat completions.
        response: dict = ollama.generate(model=DLModelWeights.LLM.value, keep_alive="12h", prompt=prompt)
        
        answer: str = response['response']  # Extract the content of the response
        return answer  # Return the answer

    def verify_llm_download(self):
        """
        Verifies if the LLM model is downloaded, and if not, pulls it from the Ollama repository.
        """
        name = DLModelWeights.LLM.value.lower()
        downloaded_models = [x["model"] for x in ollama.list()['models']]
        model_valid = name in downloaded_models
        if not model_valid:
            print('INFO: Pulling LLM Model', DLModelWeights.LLM.value)
            ollama.pull(name)
    
    def setup(self, device: str) -> None:
        """
        Sets up the API by initializing necessary models and resources.
        Called once at startup to build a compound AI system, connect databases, or load data.
        """
        self.verify_llm_download()
        self.ask_ollama("")  # Load the model by sending an initial prompt

    def decode_request(self, request: dict) -> str:
        """
        Decodes the incoming request to extract the input prompt.
        Returns the prompt as a string.
        """
        return request["input"]  # Extract and return the input prompt

    def predict(self, prompt: str) -> str:
        """
        Runs inference using the Ollama model with the provided prompt.
        Returns the response from the model as a string.
        """
        response: str = self.ask_ollama(prompt)  # Get the response from the Ollama model
        return response  # Return the model's response

    def encode_response(self, output: str) -> dict:
        """
        Encodes the model's response into a dictionary to be sent as a payload.
        Returns the encoded response as a dictionary.
        """
        return {"output": output}  # Return the output wrapped in a dictionary

# (STEP 2) - START THE SERVER
if __name__ == "__main__":
    port, api_path = DLModelEndpoint.LLM.strip().split(":")[-1].split("/")
    # Scale with advanced features (batching, GPUs, etc...)
    server: ls.LitServer = ls.LitServer(LLMAPI(), accelerator='cuda', devices=1, max_batch_size=1, api_path=f'/{api_path}')  # Initialize and configure the server
    server.run(port=port)
