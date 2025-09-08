
const storeKey = 'blog.posts.v1';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const draft = { id:null, title:'', body:'' };

function load(){ return JSON.parse(localStorage.getItem(storeKey) || '[]'); }
function save(posts){ localStorage.setItem(storeKey, JSON.stringify(posts)); }
function uid(){ return Math.random().toString(36).slice(2,9); }

function render(){
  const posts = load().sort((a,b)=>b.created-a.created);
  const list = $('#list'); list.innerHTML='';
  posts.forEach(p=>{
    const div = document.createElement('div');
    div.className='post';
    div.innerHTML = `<h3>${p.title}</h3><p>${p.body}</p>
      <div class="row">
        <button data-edit="${p.id}">Edit</button>
        <button data-del="${p.id}">Delete</button>
        <button data-pub="${p.id}">${p.published ? 'Unpublish' : 'Publish'}</button>
      </div>
      <small>${new Date(p.created).toLocaleString()}</small>`;
    list.appendChild(div);
  });
}

function createOrUpdate(e){
  e.preventDefault();
  const posts = load();
  const id = draft.id || uid();
  const existing = posts.find(p=>p.id===id);
  const data = {
    id,
    title: $('#title').value.trim(),
    body: $('#body').value.trim(),
    created: existing ? existing.created : Date.now(),
    published: existing ? existing.published : false
  };
  if(existing){ Object.assign(existing, data); } else { posts.push(data); }
  save(posts);
  clearForm();
  render();
}

function clearForm(){
  draft.id = null;
  $('#title').value='';
  $('#body').value='';
  $('#submit').textContent='Publish Post';
}

function handleList(e){
  const id = e.target.getAttribute('data-edit') || e.target.getAttribute('data-del') || e.target.getAttribute('data-pub');
  if(!id) return;
  const posts = load();
  const p = posts.find(x=>x.id===id);
  if(e.target.hasAttribute('data-edit')){
    draft.id = id;
    $('#title').value = p.title;
    $('#body').value = p.body;
    $('#submit').textContent='Update Post';
    window.scrollTo({top:0, behavior:'smooth'});
  }else if(e.target.hasAttribute('data-del')){
    if(confirm('Delete this post?')){
      save(posts.filter(x=>x.id!==id));
      render();
    }
  }else if(e.target.hasAttribute('data-pub')){
    p.published = !p.published; save(posts); render();
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  $('#form').addEventListener('submit', createOrUpdate);
  $('#list').addEventListener('click', handleList);
  $('#clear').addEventListener('click', clearForm);
  render();
});
