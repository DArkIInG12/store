from django.http import HttpResponse
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from webIA.views.views import logoutApp
from django.conf import settings
import requests
import json
import os

def get_categories(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        resCategory = requests.get("http://localhost:3000/api/v1/categories",headers=req_headers)
        if resCategory.status_code == 200:
            categoryText = resCategory.text.replace("_id","atrId")
            category_json = json.loads(categoryText)
            return render(request,'categoriesAdmin.html',{"categories":category_json,"user":request.session['jwt-key']['user']})
        else:
            message = ""
            if "jwt expired" in resCategory.text:
                message = "Your session has been expired!"
                return logoutApp(request)
            elif "invalid token" in resCategory.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
            elif "The token has been revoked" in resCategory.text:
                message = "Unauthorized Access: Your token is invalid!"
                return HttpResponse(message)
    
def post_category(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        file = request.FILES["image"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        payload = {"category":request.POST["category"],
                "description":request.POST["description"],
                "image": file.name
        }
        fss = FileSystemStorage()
        fss.save(file.name,file)
        response = requests.post("http://localhost:3000/api/v1/categories/register",json=payload,headers=req_headers)
        if response.status_code == 200:
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)
    
def delete_category(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        category = request.POST["category"]
        image = request.POST["image"]
        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.delete("http://localhost:3000/api/v1/categories/{}".format(category),headers=req_headers)
        if response.status_code == 200:
            os.remove(os.path.join(settings.MEDIA_ROOT+"/"+image))
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)

def update_category(request):
    if("jwt-key" not in request.session):
        return HttpResponse("Unauthorized Access")
    else:
        id=request.POST["id"]
        oldImage = request.POST["oldImage"]
        payload = {"category":request.POST["category"],
                "description":request.POST["description"]
        }
        if("image" in request.FILES):
            file = request.FILES["image"]
            payload["image"] = file.name

        req_headers = {'Authorization' : 'Bearer {}'.format(request.session['jwt-key']['token'])}
        response = requests.put("http://localhost:3000/api/v1/categories/{}".format(id),json=payload,headers=req_headers)
        if response.status_code == 200:
            if("image" in request.FILES):
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT+"/"+oldImage))
                except:
                    pass
                fss = FileSystemStorage()
                fss.save(file.name,file)
            return HttpResponse(response)
        else:
            return HttpResponse(response.status_code)