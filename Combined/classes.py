class Login:
    def logMeIn(self):
        new_id=kid()
        kans=getAllKans()
        shared=allSharedKans()
        d={}
        d['k_id']=new_id
        kan_list=[]
        shared_list=[]
        for kan in kans:
            kan_list.append(kan['kid'])
        d['kans']=kan_list
        for share in shared:
            shared_list.append(share['kid'])
        d['shared']=shared_list
        dJson=json.dumps(d)
        return render_template('home.html',data=dJson)
