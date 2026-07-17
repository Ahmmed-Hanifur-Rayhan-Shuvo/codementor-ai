"""
Quick test script to verify API configuration
Run this after setting up .env file
"""

import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def test_api():
    """Test the OpenRouter API connection"""
    
    print("🔍 Testing API Configuration...")
    print(f"API Key: {os.getenv('OPENAI_API_KEY')[:10]}...")
    print(f"Base URL: {os.getenv('OPENAI_BASE_URL')}")
    
    try:
        # Initialize client
        client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        )
        
        # Send test request
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash:free",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello! API is working!' in one sentence."}
            ],
            max_tokens=50,
            temperature=0.1
        )
        
        # Print result
        print("\n✅ API Connection Successful!")
        print(f"Response: {response.choices[0].message.content}")
        print(f"Model used: {response.model}")
        print(f"Tokens used: {response.usage.total_tokens}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ API Connection Failed!")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_api()