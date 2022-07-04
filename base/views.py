from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random, time

def getToken(request):

    appId = "f2c106a8a589424c8aae1554b5606072"
    appCertificate = "9ea1fb878a8c44cbb012921f7bef5296"
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