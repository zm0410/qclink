fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const directory = document.getElementById('directory');
        const siteList = document.getElementById('site-list');

        // Create a nested directory tree
        const categories = buildCategories(data);
        renderCategories(categories, directory);

        // Render categories recursively
        function renderCategories(categories, parentElement) {
            categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.name;
                li.style.fontWeight = 'bold';
                parentElement.appendChild(li);

                // If the category has subcategories, render them as well
                if (category.subcategories && category.subcategories.length > 0) {
                    const subUl = document.createElement('ul');
                    subUl.style.marginLeft = '20px';
                    li.appendChild(subUl);
                    renderCategories(category.subcategories, subUl);
                }

                // Add event listener to filter sites on click
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    filterSites(category.name);
                });
            });
        }

        // Build a hierarchical structure for categories
        function buildCategories(data) {
            const categoriesMap = {};
            data.forEach(item => {
                const categoryPath = item['分类'].split('/');
                let currentLevel = categoriesMap;
                categoryPath.forEach(part => {
                    if (!currentLevel[part]) {
                        currentLevel[part] = { name: part, subcategories: [] };
                    }
                    currentLevel = currentLevel[part].subcategories;
                });
                item['站点名称'] = item['站点名称'];
                item['站点地址'] = item['站点地址'];
                item['站点说明'] = item['站点说明'];
            });

            return Object.values(categoriesMap);
        }

        // Filter sites by category
        function filterSites(category) {
            const filteredSites = data.filter(item => item['分类'].startsWith(category));
            siteList.innerHTML = '';
            filteredSites.forEach(site => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${site['站点名称']}</strong><br><a href="${site['站点地址']}" target="_blank">${site['站点地址']}</a><br><small>${site['站点说明']}</small>`;
                siteList.appendChild(li);
            });
        }
    });
