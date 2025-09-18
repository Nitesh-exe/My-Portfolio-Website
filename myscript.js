document.addEventListener("DOMContentLoaded", () => {

    // for dark/light mode
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;

    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPrefersDark) {
        body.classList.add('dark');
    }

    themeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
    });


    // github portfolio script
    if (body.id === 'projects-page') {
        const GITHUB_USERNAME = "Nitesh-exe"; 
        const projectsList = document.getElementById('projects-list');

        // fetch and display
        const fetchGithubRepos = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                const repos = await response.json();
                
                // clear loading
                projectsList.innerHTML = '';
                
                if (repos.length === 0) {
                    projectsList.innerHTML = '<p>No public repositories found.</p>';
                    return;
                }

                repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

                repos.forEach(repo => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    
                    const projectInfo = document.createElement('div');
                    projectInfo.className = 'project-info';
                    
                    projectInfo.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description provided.'}</p>
                    `;

                    const projectActions = document.createElement('div');
                    projectActions.className = 'project-actions';
                    
                    if (repo.homepage) {
                         projectActions.innerHTML += `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer">Live Demo</a>`;
                    }
                    projectActions.innerHTML += `<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>`;
                    
                    projectInfo.appendChild(projectActions);
                    projectCard.appendChild(projectInfo);

                    // image thumbnail
                    const galleryContainer = document.createElement('div');
                    galleryContainer.className = 'gallery-container';
                    
                    const imageCount = 6; // max limit of no. of images
                    for (let i = 1; i <= imageCount; i++) {
                        // image path relative to the HTML file
                        const imgPath = `images/${repo.name}/image${i}.jpg`;
                        
                        const thumbnailWrapper = document.createElement('div');
                        thumbnailWrapper.className = 'thumbnail-wrapper';
                        
                        const imgElement = document.createElement('img');
                        imgElement.className = 'gallery-image';
                        imgElement.src = imgPath;
                        imgElement.alt = `Project Image ${i} for ${repo.name}`;
                        
                        // if image does not exist
                        imgElement.onerror = () => {
                            thumbnailWrapper.style.display = 'none';
                        };
                        
                        thumbnailWrapper.appendChild(imgElement);
                        galleryContainer.appendChild(thumbnailWrapper);
                    }
                    
                    projectCard.appendChild(galleryContainer);
                    projectsList.appendChild(projectCard);
                });
            } catch (error) {
                console.error("Failed to fetch GitHub repositories:", error);
                projectsList.innerHTML = '<p>Could not load projects. Please check your GitHub username and internet connection.</p>';
            }
        };

        fetchGithubRepos();

    // imag emodal
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("modal-image");
        const captionText = document.getElementById("caption");
        const closeBtn = document.getElementsByClassName("close-btn")[0];

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-image')) {
                modal.style.display = "block";
                const originalSrc = e.target.src;
                modalImg.src = originalSrc;
                captionText.innerHTML = e.target.alt;
            }
        });

    
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        // close modal whenclicked anywhere outside of the image
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
