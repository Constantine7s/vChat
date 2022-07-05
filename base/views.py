from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RoomUser
import random, time, json

def getToken(request):

    appId = "YOUR APP ID"
    appCertificate = "YOUR APP CERTIFICATE"
    channelName = request.GET.get('channel')
    uid = random.randint(1,230)
    role = 1
    expirationTime = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs= currentTimeStamp + expirationTime
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token, 'uid': uid}, safe=False)

def home(request):
    return render(request, 'base/home.html')

def room(request):
    return render(request, 'base/room.html')

@csrf_exempt
def createUser(request):
    data = json.loads(request.body)
    user, created = RoomUser.objects.get_or_create(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )
    return JsonResponse({'name': data['name']}, safe=False)

def getUser(request):
    uid = request.GET.get('UID') 
    room_name = request.GET.get('room_name') 
    user = RoomUser.objects.get(
        uid=uid,
        room_name=room_name
    )
    return JsonResponse({'name': user.name},safe=False)

@csrf_exempt
def deleteUser(request):
    data = json.loads(request.body)
    user = RoomUser.objects.get(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )
    user.delete()
    return JsonResponse('Successfully deleted user', safe=False)