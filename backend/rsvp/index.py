import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для обработки откликов гостей на свадьбу'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            phone = body.get('phone', '').strip()
            attendance = body.get('attendance', '').strip()
            guests_count = body.get('guestsCount', 1)
            dietary_restrictions = body.get('dietaryRestrictions', [])
            other_dietary = body.get('otherDietary', '').strip()
            message = body.get('message', '').strip()
            
            if not name or not email or not attendance:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Name, email and attendance are required'})
                }
            
            if attendance not in ['yes', 'no']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid attendance value'})
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    '''INSERT INTO rsvp_responses 
                       (name, email, phone, attendance, guests_count, dietary_restrictions, other_dietary, message) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
                       RETURNING id''',
                    (name, email, phone, attendance, guests_count, dietary_restrictions, other_dietary, message)
                )
                result = cur.fetchone()
                response_id = result[0]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': response_id, 'message': 'Response saved successfully'})
            }
        
        elif method == 'GET':
            admin_key = event.get('headers', {}).get('X-Admin-Key', '')
            expected_key = os.environ.get('ADMIN_KEY', 'changeme')
            
            if admin_key != expected_key:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''SELECT id, name, email, phone, attendance, guests_count, 
                              dietary_restrictions, other_dietary, message, 
                              created_at 
                       FROM rsvp_responses 
                       ORDER BY created_at DESC'''
                )
                responses = cur.fetchall()
                
                for response in responses:
                    if response['created_at']:
                        response['created_at'] = response['created_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'responses': responses})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        conn.close()
