#!/usr/bin/env python3
"""
Script to download eucalyptus branch images and upload them to S3.
"""

import os
import sys
import requests
import boto3
from botocore.exceptions import ClientError

# Image URLs to download
IMAGES = [
    {
        'url': 'https://cdn.poehali.dev/files/7.png',
        'key': 'eucalyptus-branch-1.png'
    },
    {
        'url': 'https://cdn.poehali.dev/files/8.png',
        'key': 'eucalyptus-branch-2.png'
    }
]

def download_image(url):
    """Download image from URL and return content."""
    print(f"Downloading image from {url}...")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    print(f"Downloaded {len(response.content)} bytes")
    return response.content

def upload_to_s3(s3_client, bucket_name, key, content):
    """Upload content to S3 bucket."""
    print(f"Uploading to S3: s3://{bucket_name}/{key}...")
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=content,
            ContentType='image/png',
            ACL='public-read'
        )
        print(f"Successfully uploaded {key}")
        return True
    except ClientError as e:
        print(f"Error uploading {key}: {e}")
        return False

def main():
    """Main function to download and upload images."""
    # Get AWS credentials from environment
    aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('S3_BUCKET_NAME', 'bucket')
    
    if not aws_access_key or not aws_secret_key:
        print("Error: AWS credentials not found in environment variables.")
        print("Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")
        sys.exit(1)
    
    # Initialize S3 client
    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=os.environ.get('AWS_REGION', 'us-east-1')
    )
    
    uploaded_urls = []
    
    # Process each image
    for image in IMAGES:
        try:
            # Download image
            content = download_image(image['url'])
            
            # Upload to S3
            if upload_to_s3(s3_client, bucket_name, image['key'], content):
                # Generate CDN URL
                cdn_url = f"https://cdn.poehali.dev/projects/{aws_access_key}/{bucket_name}/{image['key']}"
                uploaded_urls.append({
                    'key': image['key'],
                    'url': cdn_url
                })
                print(f"CDN URL: {cdn_url}")
            else:
                print(f"Failed to upload {image['key']}")
                
        except Exception as e:
            print(f"Error processing {image['url']}: {e}")
    
    # Summary
    print("\n" + "="*60)
    print("UPLOAD SUMMARY")
    print("="*60)
    if uploaded_urls:
        print(f"Successfully uploaded {len(uploaded_urls)} images:")
        for item in uploaded_urls:
            print(f"  - {item['key']}")
            print(f"    URL: {item['url']}")
    else:
        print("No images were uploaded successfully.")
        sys.exit(1)
    
    print("="*60)

if __name__ == '__main__':
    main()
