from django.http import HttpResponse
from django.shortcuts import render
from webIA.views.views import logoutApp
import requests
import json

def get_payments(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resPayment = requests.get("http://localhost:3000/api/v1/payments",headers=req_headers)
        if resPayment.status_code == 200:
            paymentText = resPayment.text.replace("_id","atrId")
            payment_json = json.loads(paymentText)
            return render(request,'paymentsAdmin.html',{"payments":payment_json,"user":request.session['jwt-key']['user']})
        else:
            message = ""
            if "jwt expired" in resPayment.text:
                message = "Your session has been expired!"
                return logoutApp(request)
            elif "invalid token" in resPayment.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in resPayment.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
    
def post_payment(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        payload = {"method":request.POST["method"]
        }
        response = requests.post("http://localhost:3000/api/v1/payments/register",json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)
    
def delete_payment(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        payment = request.POST["payment"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/payments/{}".format(payment),headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def update_payment(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        payload = {"method":request.POST["method"]
        }
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/payments/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)