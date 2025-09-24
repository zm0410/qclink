fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const directory = document.getElementById('directory');
        const siteList = document.getElementById('site-list');

        // 生成目录树
        const categories = [...new Set(data.map(item => item['分类']))];
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => filterSites(category));
            directory.appendChild(li);
        });

        // 根据分类过滤并显示站点信息
        function filterSites(category) {
            const filteredSites = data.filter(item => item['分类'] === category);
            siteList.innerHTML = '';
            filteredSites.forEach(site => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${site['站点名称']}</strong><br><a href="${site['站点地址']}" target="_blank">${site['站点地址']}</a><br><small>${site['站点说明']}</small>`;
                siteList.appendChild(li);
            });
        }
    });