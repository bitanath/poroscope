import datetime
import requests
import random
import boto3
import json
import time
import os
from concurrent.futures import ThreadPoolExecutor

def get_secret(secret_name):
    client = boto3.client('ssm')
    parameter_name = f"/amplify/shared/d17o49q02hg78d/{secret_name}"
    response = client.get_parameter(Name=parameter_name, WithDecryption=True)
    return response['Parameter']['Value']


def handler(event, context):
    # WebSocket API Gateway client for sending messages
    apigateway_client = boto3.client('apigatewaymanagementapi', 
                                   endpoint_url='https://your-websocket-api-id.execute-api.region.amazonaws.com/stage')
    lambda_client = boto3.client('lambda')
    
    connection_id = event.get('connectionId')
    puuid = event.get('puuid')
    
    try:
        # Send initial progress
        send_progress(apigateway_client, connection_id, "Starting analysis...", 0)
        
        # Step 1: Fetch matches
        send_progress(apigateway_client, connection_id, "Fetching match data...", 20)
        match_response = lambda_client.invoke(
            FunctionName='match-fetcher',
            Payload=json.dumps({'puuid': puuid})
        )
        matches = json.loads(json.loads(match_response['Payload'].read())['body'])
        
        # Step 2: Analyze performance
        send_progress(apigateway_client, connection_id, "Analyzing performance...", 50)
        analysis_response = lambda_client.invoke(
            FunctionName='performance-analyzer',
            Payload=json.dumps({'matches': matches['matches'], 'puuid': puuid})
        )
        
        # Step 3: Generate insights
        send_progress(apigateway_client, connection_id, "Generating insights...", 80)
        insights_response = lambda_client.invoke(
            FunctionName='insight-generator',
            Payload=json.dumps({'analysis': analysis_response})
        )
        
        # Final result
        send_progress(apigateway_client, connection_id, "Complete!", 100, is_complete=True)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Analysis complete'})
        }
        
    except Exception as e:
        send_progress(apigateway_client, connection_id, f"Error: {str(e)}", -1, is_error=True)
        raise

def send_progress(client, connection_id, message, progress, is_complete=False, is_error=False):
    try:
        client.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps({
                'type': 'progress',
                'message': message,
                'progress': progress,
                'complete': is_complete,
                'error': is_error,
                'timestamp': int(time.time())
            })
        )
    except Exception as e:
        print(f"Failed to send progress: {e}")