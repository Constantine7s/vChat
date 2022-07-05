from . import views
from django.urls import path

urlpatterns = [
    path('', views.home),
    path('room/', views.room),
    path('gettoken/', views.getToken),
    path('createuser/',views.createUser),
    path('getuser/', views.getUser)
]