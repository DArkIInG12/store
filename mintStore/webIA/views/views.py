from django.http import HttpResponse
from django.shortcuts import render,redirect
import requests
import json

def index(request):
    #del request.session['cart']
    template = "base.html"
    if 'cart' not in request.session:
        request.session['cart'] = []
    resCategory = requests.get("http://localhost:3000/api/v1/categories/products")
    if resCategory.status_code == 200:
        categoryText = resCategory.text.replace("_id","atrId")
        category_json = json.loads(categoryText)
        if "jwt-key" in request.session:
            template = "baseCustomer.html"
            return render(request,'index.html',{"categories":category_json,"template":template,"user":request.session['jwt-key']['user']})
        else:
            return render(request,'index.html',{"categories":category_json,"template":template})
    else:
        return HttpResponse("Error")

def register(request):
    return render(request,'register.html')

def login(request):
    return render(request,'login.html')

def cart(request):
    template = "base.html"
    if("jwt-key" in request.session):
        if request.session['jwt-key']['role']['role'] == "Customer":
            template = "baseCustomer.html"
            return render(request,'cart.html',{"template":template,"user":request.session['jwt-key']['user']})
        else:
            return HttpResponse("Unauthorized Access")
    else:   
        res = []
        if len(request.session['cart']) != 0:
            for i in request.session['cart']:
                response = requests.get("http://localhost:3000/api/v1/products/product/{}".format(i))
                if response.status_code == 200:
                    product = response.text.replace("_id","atrId")
                    product_json = json.loads(product)
                    res.append(product_json)
            return render(request,'cart.html',{"template":template,"products":res})
        else:
            return render(request,'cart.html',{"template":template,"products":[]})

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
            return redirect('index')
        else:
            return HttpResponse('indexWorker has not programmed yet')
    else:
        jsonText = json.loads(response.text)
        return HttpResponse(jsonText["message"])
    
def logoutApp(request):
    del request.session['jwt-key']
    return redirect('login')

'''FUNCIONES DE APOYO PARA VALIDACION DE PETICIONES'''
def validarCampos(request):
    pass