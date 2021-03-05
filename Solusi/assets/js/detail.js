const id = window.location.search?.split("=")[1];

const append = (item) => {

    let root = document.querySelector("#root");

    root.innerHTML = `<article>
             <div style="display: block; width: 100%; height: 300px;" className="article-image">
                <img style="width: 100%; height: 300px; object-fit: cover; border-radius: 0"  src="${item.image}" alt="${item.title}"/>
            </div>
            <div style="padding: 0 15px;" className="article-content">
                <h4 style="color: #ff5483; margin-bottom: 5px;">${item.title}</h4>
                <p style="font-size: 14px;"> ${item.content}</p>
                <br/>
            </div>
        </article>`
}

const read = async () => {

    try {
        const snapshot = await firebase.firestore()
            .collection("article")
            .doc(id)
            .get();

        append(snapshot.data());

        analytics.logEvent('select_content', {
            name : snapshot.data().title,
            content_type: 'article',
            content_id: id
        });


    } catch (e) {

        window.alert(e.message);
    }
}

read();

let actionEl = document.querySelector("#action");
let deleteEl = document.querySelector("#delete");
let editEl   = document.querySelector("#edit");

if (session) {

    actionEl.style.display = "block";

    deleteEl.addEventListener("click", async () => {

        let confirm = window.confirm("Apakah anda yakin?");

        if (confirm) {

            await firebase.firestore().collection("article").doc(id).delete();

            window.alert("Artikel berhasil dihapus.");

            window.location.href = "/index.html";
        }
    });

    editEl.addEventListener("click", () => {

        window.location.href = "/edit.html?id=" + id;
    })

} else {

    actionEl.style.display = "none";
}
