// -- DOM SELECTORS -- //
const projectsContainer = document.getElementById("projects");
const profileInfo = document.getElementById("profileInfo");

// -- API -- //
const USER = "brunsant";
const REPOS_URL = `https://api.github.com/users/${USER}/repos`;
const USER_API = `https://api.github.com/users/${USER}`;

// -- PROFILE INFO -- //
const getUser = () => {
  fetch(USER_API)
    .then((response) => response.json())
    .then((data) => {
      profileInfo.innerHTML += `
          <h2> Profile Info </h2>
          <img src = "https://avatars.githubusercontent.com/u/80712035?v=4" alt="Profile picture">
          <h4> ${data.name}</h4>
          <h4> <a href =${data.html_url}>${data.login}</h4>
          `;
    });
};

// -- REPOS -- //
const getRepos = () => {
  fetch(REPOS_URL)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const forkedRepos = json.filter(
        (project) => project.fork && project.name.startsWith("project-")
      );

      // -- COMMIT -- //
      forkedRepos.forEach((project) => {
        const COMMIT_URL = `https://api.github.com/repos/${USER}/${project.name}/commits`;
        fetch(COMMIT_URL)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            const filteredCommits = json.filter(
              (project) => project.commit.author.name === "Bruna Santos Araujo"
            );

            // makes the first letter an upper case
            const upperCaseName =
              project.name.charAt(0).toUpperCase() + project.name.slice(1);

            projectsContainer.innerHTML += `
            <div class="projects-individual">
          <h3> Project Name: ${upperCaseName}</h3>
          <a href = ${project.html_url}> ${upperCaseName} </a>
          <p> Main branch: ${project.default_branch}</p>
          <p> Number of commits: ${filteredCommits.length}</p>
          <p> Latest push: ${project.pushed_at.slice(
            0,
            10
          )}, ${project.pushed_at.slice(11, 16)} 
          </p>
          <p id="pull-${project.name}"></p>
          </div>
                   `;
          });
      });
      getPulls(forkedRepos);
      drawChart(forkedRepos.length);
    });
};

// -- PULL REQUEST -- //
const getPulls = (forkedRepos) => {
  forkedRepos.forEach((project) => {
    fetch(
      `https://api.github.com/repos/Technigo/${project.name}/pulls?per_page=100`
    )
      .then((response) => response.json())
      .then((pulldata) => {
        const myPullRequest = pulldata.find(
          (pull) => pull.user.login === project.owner.login
        );

        if (myPullRequest) {
          document.getElementById(`pull-${project.name}`).innerHTML = `
            <a href = ${myPullRequest.html_url}>Pull request</>`;
        } else {
          document.getElementById(`pull-${project.name}`).innerHTML = `
            No pull request available`;
        }
      });
  });
};

getRepos();
getUser();
