import json
import os
import boto3
import requests
from io import BytesIO

def handler(event: dict, context) -> dict:
    '''Загружает веточки эвкалипта в S3 хранилище проекта'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # URLs изображений
        images = [
            {'url': 'https://cdn.poehali.dev/files/7.png', 'key': 'eucalyptus-branch-1.png'},
            {'url': 'https://cdn.poehali.dev/files/8.png', 'key': 'eucalyptus-branch-2.png'}
        ]
        
        # S3 клиент
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        uploaded = []
        
        for img in images:
            # Скачиваем изображение
            response = requests.get(img['url'])
            response.raise_for_status()
            
            # Загружаем в S3
            s3.put_object(
                Bucket='files',
                Key=img['key'],
                Body=BytesIO(response.content),
                ContentType='image/png',
                ACL='public-read'
            )
            
            # Формируем CDN URL
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{img['key']}"
            uploaded.append({'key': img['key'], 'url': cdn_url})
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'images': uploaded
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
