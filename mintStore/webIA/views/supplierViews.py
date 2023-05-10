from django.http import HttpResponse
from django.shortcuts import render
from webIA.views.views import logoutApp
import requests
import json

def get_suppliers(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resSupplier = requests.get("http://localhost:3000/api/v1/suppliers",headers=req_headers)
        if resSupplier.status_code == 200:
            supplierText = resSupplier.text.replace("_id","atrId")
            suppliers_json = json.loads(supplierText)
            return render(request,'suppliersAdmin.html',{"suppliers":suppliers_json,"user":request.session['jwt-key']['user']})
        else:
            if "jwt expired" in resSupplier.text:
                return logoutApp(request)
            elif "invalid token" in resSupplier.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in resSupplier.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
    
def post_supplier(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        payload = {"name":request.POST["name"],
                "phone":request.POST["phone"],
                "email":request.POST["email"],
                "address":request.POST["address"]
        }
        response = requests.post("http://localhost:3000/api/v1/suppliers/register",json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def delete_supplier(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        supplier = request.POST["supplier"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/suppliers/{}".format(supplier),headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def update_supplier(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        payload = {"name":request.POST["name"],
                "phone":request.POST["phone"],
                "email":request.POST["email"],
                "address":request.POST["address"]
        }
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/suppliers/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)