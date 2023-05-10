from django.http import HttpResponse
from django.shortcuts import render
from webIA.views.views import logoutApp
import requests
import json

def get_coupons(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resCoupon = requests.get("http://localhost:3000/api/v1/coupons",headers=req_headers)
        if resCoupon.status_code == 200:
            couponText = resCoupon.text.replace("_id","atrId")
            coupon_json = json.loads(couponText)
            return render(request,'couponsAdmin.html',{"coupons":coupon_json,"user":request.session['jwt-key']['user']})
        else:
            message = ""
            if "jwt expired" in resCoupon.text:
                message = "Your session has been expired!"
                return logoutApp(request)
            elif "invalid token" in resCoupon.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in resCoupon.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
    
def post_coupon(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        payload = {"coupon":request.POST["coupon"],
                "value":request.POST["value"]
        }
        response = requests.post("http://localhost:3000/api/v1/coupons/register",json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)
    
def delete_coupon(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        coupon = request.POST["coupon"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/coupons/{}".format(coupon),headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def update_coupon(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        payload = {"coupon":request.POST["coupon"],
                "value":request.POST["value"]
        }
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/coupons/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)