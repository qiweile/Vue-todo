(function (window,Vue,undefined) {
	new Vue({
		el:'#app',
		data:{
			list:JSON.parse(window.localStorage.getItem('list'))||[], //{id:1,content:'abc',isFinish:false}
			value:'',
			newContent:{},
			activeBtn:1,
			showarr:[]
		},
		computed:{
			overList(){
				return this.list.filter(num=>!num.isFinish).length;
			},
			toggle:{
				get(){ //监听data中的所有事件的改变
					return this.list.every(num=>num.isFinish);
				},
				// 设置计算属性
				set(val){ //只监听v-model绑定的toggle改变的事件
					this.list.forEach(num=>num.isFinish = val);
				}
			}
		},
		methods:{
			newTodo(){
				if(!this.value.trim()){return};
				this.list.push({
					id:this.list.length?this.list.sort((a,b)=>{ a.id-b.id})[this.list.length-1]['id']+1:1,
					content:this.value.trim(),
					isFinish:false
				})
				this.value = '';
			},
			tododelete(i){
				this.list.splice(i,1);
			},
			allDelete(){
				this.list = this.list.filter(num=>!num.isFinish);
			},
			showBorder(index){
				this.$refs.showEdit.forEach(num=>{
					num.classList.remove('editing');
				})
				this.$refs.showEdit[index].classList.add('editing');
				this.newContent = JSON.parse(JSON.stringify(this.list[index]));
			},
			//保存
			Preservation(index){
				if(!this.list[index].content) return this.list.splice(index,1);
				if(this.list[index].content.trim() != this.newContent.content) this.list[index].isFinish = false;
				this.$refs.showEdit[index].classList.remove('editing');
			},
			//撤销修改
			esc(index){
				this.list[index].content = this.newContent.content;
			},
			hashchange(){
				switch(window.location.hash){
					case '':
					case '#/':
						this.showall();
						this.activeBtn = 1
						break
					case '#/active':
						this.judge(false)
						this.activeBtn = 2
						break
						case '#/completed':
						this.judge(true)
						this.activeBtn = 3
						break
				}
			},
			showall(){
				this.showarr = this.list.map(()=> true)
			},
			judge(bool){
				this.showarr = this.list.map(ele => ele.isFinish === bool);
				if(this.list.every(num=>num.isFinish ==!bool)){
					window.location.hash = '#/';
				}
			}
		},
		watch:{
			list:{
				handler(newVal){
					window.localStorage.setItem('list',JSON.stringify(newVal));
					this.hashchange();
				},
				deep:true
			}
		},
		directives:{
			focus:{
				inserted(el){
					el.focus();
				}
			}
		},
		created(){
			this.hashchange();
			this.hashchange();
			window.onhashchange = ()=>{
				this.hashchange();
			}
		}
	})


})(window,Vue);
