const id        = window.location.search?.split("=")[1];
const form      = document.querySelector("form");
const btnSubmit = document.querySelector("#button-submit");
const progress  = document.querySelector("#myProgress");

let downloadURL = "";

const read = async () => {

    try {

        btnSubmit.textContent = "Loading...";
        btnSubmit.disabled = true;
        progress.style.display = "block";

        const snapshot = await firebase.firestore()
            .collection("article")
            .doc(id)
            .get();

        const data = snapshot.data();

        downloadURL = data.image;

        const {title, category, content} = form;

        title.value    = data.title;
        category.value = data.category;
        content.value  = data.content;

    } catch (e) {

        window.alert(e.message);

    } finally {

        btnSubmit.textContent = "Simpan";
        btnSubmit.disabled = false;
        progress.style.display = "none";
    }
}

read();

const createKeyword = (title) => {

    const arrTitle = [];
    let currTitle  = "";

    title.split("").forEach(item => {
        currTitle += item;
        arrTitle.push(currTitle);
    })

    return arrTitle
};

const generateKeyword = (title) => {

    const keywords = [];
    const titles   = title.split(" ");

    for (let i in titles) {

        keywords.push(...createKeyword(titles.slice(i, titles.length).join(" ")))
    }

    return [
        ...new Set(["", ...keywords])
    ]
};

form.addEventListener("submit", async event => {
    try {

        btnSubmit.textContent = "Loading...";
        btnSubmit.disabled = true;
        progress.style.display = "block";

        event.preventDefault();

        const {image, title, category, content} = event.target;

        const file = image.files[0];

        if (file) {

            downloadURL = await new Promise((resolve, reject) =>  {

                let storageRef = firebase.storage().ref(`images/articles/${file.name}`);
                let uploadTask = storageRef.put(file);
                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    progress.children[0].style.width = percent + "%";

                }, (error) => {

                    return reject(error);
                    // Handle unsuccessful uploads
                }, () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                        progress.style.display = "none";

                        return resolve(downloadURL);
                    });
                });
            });
        }

        await firebase
            .firestore()
            .collection("article")
            .doc(id)
            .update({
                image    : downloadURL,
                title    : title.value,
                category : category.value,
                content  : content.value,
                keywords : generateKeyword(title.value.toLocaleLowerCase())
            })

        window.alert("Artikel berhasil diperbarui.");

        window.location.href = "/detail.html?id=" + id;

    } catch (e) {

        alert(e.message);

    } finally {

        btnSubmit.textContent = "Simpan";
        btnSubmit.disabled = false;
        progress.style.display = "none";
    }
})
