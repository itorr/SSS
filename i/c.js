var 
Q=function($,win,doc){
	var
	M=$('#m'),
	html=$('html'),
	body=$('body'),
	X,
	Ur=function(h){
		return 'x/'+h+'.json';
		/*这里是JSON URL*/
	},
	x=function(h,l,j,k,g){
		return $.x(Ur(h),l,j,k,g);
	},
	getM=function(name){
		return $('#_'+name+'_').innerHTML;
	},
	tranH=function(t,f){
		switch(typeof f){
			case 'function':
				f(t);
				break;
			case 'object':
				f.innerHTML=t;
				break;
			case 'string':
				$(f).innerHTML=t;
				break;
			default:
				return t;
				break;
		}
	},
	MD=function(t,i,r,f){
		if(!f){
			f=r;
			r=function(i){return i};
		}
		t=getM(t);
		t=Mustache.render(t,r(i));
		tranH(t,f);

		return t;
	},
	MX=function(t,d,r,f){
		if(!f){
			f=r;
			r=function(i){return i};
		}
		t=getM(t);
		return X=x(d,function(i){
			if(i.error)
				return alert(i.error);

			t=Mustache.render(t,r(i));
			tranH(t,f);
		});
	},
	Q={
		home:function(){
			M.innerHTML=getM('home');

			/*流量*/
			var user,
			showUserDischarge=function(r){
				r.freeLine=r.usedFreeBd/r.freeBd*100;
				r.buyLine=r.usedBuyBd/r.buyBd*100;

				var 
				b=$.S('.discharge-line b'),
				a=$.S('.discharge-info');
				b[0].style.cssText='width:'+r.freeLine+'%';
				b[1].style.cssText='width:'+r.buyLine+'%';

				a[0].innerHTML='免费流量: '+r.freeBd+'M , 已用 '+r.usedFreeBd+'M'
				a[1].innerHTML='付费流量: '+r.buyBd+'M , 已用 '+r.usedBuyBd+'M'
			};


			MX('discharge','getUserInfo',function(r){
				user=r;
				MD('mycard',r,'#mycard-box');

				

				return r
			},function(h){

					$('#discharge-box').innerHTML=h;
					showUserDischarge(user);
			});


			MX('notice','getNotice',function(h){
				$('#notice-box').innerHTML=h;


				for(var lis=$.S('#notice-box li'),i=0,l=lis.length;i<l;i++)lis[i].onclick=function(){
					
					if(this.className=='min'){
						var v=$('.big');
						if(v)
							v.className='min';

						this.className='big'
					}else{
						this.className='min'
					}
				}
				lis[0].className='big'
			});


			MX('reward','getReward',function(r){
				r.msg=
				r.status=='done'?'签到成功~':
				r.status?r.msg='今天尚未签到':
				'当前不可签到';
				
				return r;
			},function(h){
				$('#reward-box').innerHTML=h;
				var button=$('#reward-box button');
				button.onclick=function(){
					x('Reward',function(r){
						if(r.error)
							return r.error;

						alert('签到成功～获得免费流量 '+r.reward+'MB');
						user.freeBd=user.freeBd*1+r.reward*1;

						showUserDischarge(user);

						$('#reward-box p').innerHTML='签到成功~';
						button.className='reward-false';
					})
				}

			});

			MX('invite','showInvite',function(h){
				$('#invite-box').innerHTML=h;

				var a=$('#invite-box a');
				$('#invite-box a').onclick=function(){
					x('getInvite',function(r){
						for(var i=0,l=r.length,h='';i<l;i++)
							h+='<li class="invite- invite-availble"><i class="i-available"></i>'+r[i]+'</li>'
						
						$('#invite-box ul').innerHTML+=h;
						$.D.d(a);
					});
					return false
				}
			})
			
			MX('server','getServerInfo','#server-box')

			MX('conn','getConn','#conn-box')
		},server:function(){
			M.innerHTML=getM('server2conn');

			MX('server','getServerInfo','#server-box')

			MX('conn','getConn','#conn-box')
		},me:function(){
			MX('me','getUserInfo',function(h){
				m.innerHTML=h;
				$.j('i/itorr.f.js',function(){
					$.onsubmit($('form'),Ur('setUser'),function(r){
						if(r.error)
							return alert(r.error);
						alert('修改成功');
						location.hash='#!home';

					},function(){
						alert('修改出错');
					});
				});
			});

		},logout:function(){
			x('logout',function(){
				location.href='/'
			});
		}
	};
	/*
 	$('#nav').innerHTML=Mustache.render($('#_nav_').innerHTML,[
	 	{
	 		name:'home',
	 		title:'管理界面'
	 	},
	 	{
	 		name:'server',
	 		title:'节点列表'
	 	},
	 	{
	 		name:'me',
	 		title:'修改资料'
	 	}
 	]);
	*/

 	var Title=document.title//+=' - '+$('p').innerHTML;

	var laHash='简直惨惨惨OAQ',popstate=function(){
		
		if('onhashchange' in win)win.onhashchange=popstate;

		if(laHash==location.hash)
			return;


		var lash=location.hash.substring(2);
		var L=lash.split('/');

		if(!Q[L[0]]){
			location.hash='#!home';
			return
		}

		if(laHash.split('/')[0]!=L[0]){
			M.style.cssText='transition:none';
			M.className='h';
			setTimeout(function(){
				M.style.cssText='';
				M.className='';
			},10);
		}
		
		laHash=location.hash;



		body.className='body-'+L[0];
		Q[L.shift()](L);

	};

	x('getUserInfo',function(r){
		if(r.error){
			if(r.error='403')
				location.hash='#!logout'
			else
				alert(r.error)

			return 
		}

		popstate();
	});
	

	if(!'onhashchange' in win)
		setInterval(function(){
			if(laHash!=location.hash){
				popstate();
				laHash=location.hash;
			}
		},100);

	console.log('SSS @卜卜口<sss.camp> 2014/12/15');
	/*这行注释的意义在于，愿看到代码的能保留上面一行 OAQ */
	return Q
}(iTorr,window,document);


