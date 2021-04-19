const users = ['jacotton', 'stephenrdoyle', 'susefranssen', 'adamjamesreid', 'avrilcoghlan'];
//when data_back is all true I know I have finished with API calls
const data_back = [];
for (const u of users) {
    data_back.push(false);
}
//will have a set of output objects to display
const repoData = [];

const repoList = document.querySelector("#repoList");
const alertModal = document.querySelector("#connection-failed");

// Make a request for a user with a given ID
for (let i = 0; i != users.length; i++) {
    let user = users[i];
    const requestString = `https://api.github.com/users/${user}/repos`;
    console.log(requestString);

    axios.get(requestString)
        .then(function (response) {
            // handle success
            for (const a of response.data) {
                console.log(a);
                const repoObj = {
                    owner: user,
                    ownerURL: a.owner.url,
                    avatarURL: a.owner.avatar_url,
                    name: a.full_name,
                    url: a.html_url,
                    upDate: new Date(a.updated_at)
                };
                repoData.push(repoObj);
                data_back[i] = true;
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            alertModal.classList.toggle("is-active");
            //I need to die more elegantly than this at some point.
        })
        .then(function () {
            // always executed
        });
}

//poll every 1/10th of a second

let myTimer = setInterval(() => {
    console.log(data_back)
    if (data_back.every((x) => { return x; })) {
        console.log("got everything");
        clearInterval(myTimer);
        clearTimeout(myTimeOut);
        //sort list
        repoData.sort((a, b) => { return b.upDate - a.upDate })
        //make LIs
        for (let a of repoData) {
            newRow = document.createElement("tr");
            tdOwner = document.createElement("td");
            tdName = document.createElement("td");
            tdDate = document.createElement("td");
            tdLink = document.createElement("td");
            tdOwner.innerText = `${a.owner}`;
            tdName.innerText = `${a.name}`;
            tdDate.innerText = `${a.upDate.getDate()}/${a.upDate.getMonth()}/${a.upDate.getFullYear()}`;

            newA = document.createElement("a");
            gitHubImg = document.createElement("img");
            gitHubImg.src = "GitHub-Mark-32px.png";
            newA.append(gitHubImg);
            newA.href = a.url;
            tdLink.append(newA);
            newRow.append(tdOwner, tdName, tdDate, tdLink)
            repoList.append(newRow);
        }
    } else {
        console.log("still waiting on API calls");
    }
}, 100)

let myTimeOut = setTimeout(() => {
    console.log("timeout on API after 20 secs");
    alertModal.classList.toggle("is-active");

    clearTimeout(myTimeOut);
    clearInterval(myTimer);
}, 20000);