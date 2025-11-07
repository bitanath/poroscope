import json

def get_json_size(match_details):
    response_json = json.dumps(match_details)
    size_mb = len(response_json.encode('utf-8')) / (1024 * 1024)
    return size_mb