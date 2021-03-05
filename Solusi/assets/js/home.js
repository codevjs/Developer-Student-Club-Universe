let lastVisible = null;
let data        = [];
let search      = "";

const append = () => {

    let root = document.querySelector("#root");

    let element = data.map(item => (
        `<article>
            <a href="/detail.html?id=${item.id}">
                <div style="display: block; width: 100%; height: 300px;" className="article-image">
                    <img style="width: 100%; height: 300px; object-fit: cover; border-radius: 0"  src="${item.image}" alt="${item.title}"/>
                </div>
                <div style="padding: 0 15px;" className="article-content">
                    <h4 style="color: #ff5483; margin-bottom: 5px;">${item.title}</h4>
                    <p style="font-size: 14px;"> ${item.content?.substr(0, 100) + '...' || ""}</p>
                    <br/>
                </div>
            </a>
        </article>`
    ))

    root.innerHTML = element.join(`<br/>`)
}

const home = async () => {

    const snapshot = await firebase.firestore()
        .collection("article")
        .where("keywords", "array-contains", search.toLocaleLowerCase())
        .orderBy("timestamp", "desc")
        .limit(2)
        .get();

    let records = [];

    snapshot.forEach(doc => {

        records.push({...doc.data(), id : doc.id});
    });

    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    data = records;

    append();
}

const loadMore = async () => {

   if (lastVisible) {
       const snapshot = await firebase.firestore()
           .collection("article")
           .where("keywords", "array-contains", search.toLocaleLowerCase())
           .orderBy("timestamp", "desc")
           .startAfter(lastVisible)
           .limit(2)
           .get();

       let records = data;

       snapshot.forEach(doc => {

           records.push({...doc.data(), id : doc.id});
       });

       lastVisible = snapshot.docs[snapshot.docs.length - 1];

       append();
   }
}

home();


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    let timeout;

    return function() {

        let context = this, args = arguments;

        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        let callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

function lazyload(){

    const scrollIsAtTheBottom = (document.documentElement.scrollHeight - window.innerHeight) === window.scrollY;

    if (scrollIsAtTheBottom) loadMore();
}

let searchEl = document.querySelector("input");

let myEfficientFn = debounce( function () {
    // All the taxing stuff you do
    search = this.value;
    home();

}, 1000);

searchEl.addEventListener("keyup", myEfficientFn)

window.addEventListener("scroll", lazyload)
