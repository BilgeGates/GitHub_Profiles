const container = document.querySelector(".container");
const form = document.querySelector("form");
const search = document.querySelector("#search");

const APIURL = "https://api.github.com/users/";

const getUser = async (username) => {
  try {
    const { data } = await axios(APIURL + username);
    userCard(data);
    getRepo(username);
  } catch (error) {
    if (error.response.status === 404) {
      showErrorMessage("No profile with this username!");
    } else {
      showErrorMessage("An error occurred. Please try again later");
    }
  }
};

const getRepo = async (username) => {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    reposCard(data);
  } catch (error) {
    showErrorMessage("An error occurred while fetching repositories");
  }
};

const userCard = (user) => {
  const userName = user.name ? user.name : "";
  const cardHTML = `
      <div class="card">
        <div class="user_custom">
          <div class="sliceFunc">Joined: ${user.created_at.slice(0, 10)}</div>
          <img src="${user.avatar_url}">
          <div>${user.location ? user.location : ""}</div>
        </div>
        <div class="user_info">
          <div class="user_desc">
            <div class="user_name">${userName}</div>
            ${user.bio ? `<div class="user_bio">${user.bio}</div>` : ""}
          </div>
          <div class="user_sub">
            <div class="user_followers">Followers: ${user.followers}</div>
            <div class="user_following">Following: ${user.following}</div>
            <div class="user_repo">Repos: ${user.public_repos}</div>
          </div>
          ${user.public_repos > 0 ? '<div class="user_repos"></div>' : ""}
        </div> 
      </div> 
    `;
  container.innerHTML = cardHTML;
};
const reposCard = (repos) => {
  const reposEl = document.querySelector(".user_repos");

  if (repos.length === 0) {
    reposEl.style.display = "none";
    return;
  }

  repos.slice(0, 3).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
};

const inputBox = (event) => {
  const user = search.value;
  event.preventDefault();

  if (user) {
    getUser(user);
    search.value = "";
  } else {
    showErrorMessage("Please enter a username");
  }
};

form.addEventListener("submit", inputBox);

const showErrorMessage = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error");
  errorDiv.innerText = message;
  container.innerHTML = "";
  container.appendChild(errorDiv);
};
