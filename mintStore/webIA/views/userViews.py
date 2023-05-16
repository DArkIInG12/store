from django.http import HttpResponse,JsonResponse
from django.shortcuts import render
from webIA.views.views import logoutApp
import requests
import json

def get_users(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.get("http://localhost:3000/api/v1/users/",headers=req_headers)
        resStatus = requests.get("http://localhost:3000/api/v1/status/",headers=req_headers)
        resRoles = requests.get("http://localhost:3000/api/v1/roles/",headers=req_headers)
        if response.status_code == 200:
            usersText = response.text.replace("_id","atrId")
            users_json = json.loads(usersText)
            statusText = resStatus.text.replace("_id","atrId")
            status_json = json.loads(statusText)
            rolesText = resRoles.text.replace("_id","atrId")
            roles_json = json.loads(rolesText)
            return render(request,'users.html',{"users":users_json,"status":status_json,"roles":roles_json,"user":request.session['jwt-key']['user']})
        else:
            #verificar codigo de error para cerrar sesion en caso de que el token haya caducado
            message = ""
            if "jwt expired" in response.text:
                message = "Your session has been expired!"
                return logoutApp(request)
            elif "invalid token" in response.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in response.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)

def post_user(request):
    role = "6429b9206d8b820d040f7fdf"
    status = "6429b9bf6d8b820d040f7fe3"
    if "role" in request.POST:
        role = request.POST["role"]
    if "status" in request.POST:
        status = request.POST["status"]
    payload = {"name":request.POST["name"],
               "lastName":request.POST["lastName"],
               "email":request.POST["email"],
               "phone":request.POST["phone"],
               "birthDate":request.POST["birthDate"],
               "role":role,
               "status":status,
               "password":request.POST["password"]
    }
    response = requests.post("http://localhost:3000/api/v1/users/register",json=payload)
    return HttpResponse(response)
    #REVISAR POSIBLE ERROR PARA MOSTRAR CON JS

def post_cart_auth(request):
    idUser = request.POST["idUser"]
    idProduct = request.POST["idProduct"]
    response = requests.post("http://localhost:3000/api/v1/users/addProduct/{}/{}".format(idUser,idProduct))
    return HttpResponse(response)

def post_cart_unauth(request):
    if 'cart' in request.session:
        idProduct = request.POST["idProduct"]
        aux = request.session['cart']
        aux.append(idProduct)
        request.session['cart'] = aux
    return JsonResponse({"response":"Product Added to cart!"})
    
def update_user(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        payload = {"name":request.POST["name"],
                "lastName":request.POST["lastName"],
                "email":request.POST["email"],
                "phone":request.POST["phone"],
                "birthDate":request.POST["birthDate"],
                "role":request.POST["role"],
                "status":request.POST["status"]
        }
        if(request.POST["password"] != ""):
            payload["password"] = request.POST["password"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/users/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)
    
def delete_user(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        user = request.POST["user"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/users/{}".format(user),headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)