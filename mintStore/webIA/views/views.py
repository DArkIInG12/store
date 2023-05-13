from django.http import HttpResponse
from django.shortcuts import render,redirect
import requests
import json

def index(request):
    resCategory = requests.get("http://localhost:3000/api/v1/categories/products")
    if resCategory.status_code == 200:
        categoryText = resCategory.text.replace("_id","atrId")
        category_json = json.loads(categoryText)
    return render(request,'index.html',{"categories":category_json})

def register(request):
    return render(request,'register.html')

def login(request):
    return render(request,'login.html')

def cart(request):
    return render(request,'cart.html')

def indexAdmin(request):
    if request.session['jwt-key']['role']['role'] == "Admin":
        return render(request,'indexAdmin.html',{"user":request.session['jwt-key']['user']})
    else:
        return HttpResponse("Unauthorized Access")

def dashboardAdmin(request):
    if request.session['jwt-key']['role']['role'] == "Admin":
        return render(request,'dashboardAdmin.html',{"user":request.session['jwt-key']['user']})
    else:
        return HttpResponse("Unauthorized Access")

def indexCustomer(request):
    return render(request,'indexCustomer.html',{"user":request.session['jwt-key']['user']})

def loginApp(request):
    payload = {"email":request.POST["email"],
               "password":request.POST["password"]
    }
    response = requests.post("http://localhost:3000/api/v1/users/login",json=payload)
    if response.status_code == 200:
        jsonText = json.loads(response.text)
        request.session['jwt-key'] = jsonText
        if request.session['jwt-key']['role']['role'] == "Admin":
            return redirect('indexAdmin')
        elif request.session['jwt-key']['role']['role'] == "Customer":
            return redirect('indexCustomer')
        else:
            return HttpResponse('indexWorker have not programmed yet')
    else:
        jsonText = json.loads(response.text)
        return HttpResponse(jsonText["message"])
    
def logoutApp(request):
    del request.session['jwt-key']
    return redirect('login')

'''FUNCIONES DE APOYO PARA VALIDACION DE PETICIONES'''
def validarCampos(request):
    pass