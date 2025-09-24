let globalData = {};
let currentCategory = null;

async function loadData() {
  const res = await fetch("data/sites.json");
  const data = await res.json();
  globalData = data;
  initExplorer(data);
}

function initExplorer(data) {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  // 左侧文件夹导航
  for (let category in data) {
    const folder = document.createElement("div");
    folder.className = "folder";
    folder.innerHTML = `<span class="arrow">▶</span> ${category}`;

    const subList = document.createElement("div");
    subList.style.display = "none";
    subList.style.marginLeft = "16px";

    // 子目录
    for (let sub in data[category]) {
      const subFolder = document.createElement("div");
      subFolder.className = "folder";
      subFolder.textContent = sub;
      subFolder.onclick = () => {
        currentCategory = category;
        showContent({ [sub]: data[category][sub] }, `${category} / ${sub}`);
      };
      subList.appendChild(subFolder);
    }

    folder.onclick = (e) => {
      // 避免点击子目录时触发父目录展开
      if (e.target !== folder) return;
      const arrow = folder.querySelector(".arrow");
      if (subList.style.display === "none") {
        subList.style.display = "block";
        arrow.textContent = "▼";
        currentCategory = category;
        showContent(data[category], category);
      } else {
        subList.style.display = "none";
        arrow.textContent = "▶";
      }
    };

    sidebar.appendChild(folder);
    sidebar.appendChild(subList);
  }

  // 默认显示第一个分类
  let first = Object.keys(data)[0];
  if (first) {
    currentCategory = first;
    showContent(data[first], first);
  }

  // 搜索框事件
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      if (currentCategory) showContent(data[currentCategory], currentCategory);
      return;
    }
    showSearchResults(query);
  });

  function showContent(categoryData, categoryName) {
    content.innerHTML = `<h2>${categoryName}</h2>`;
    for (let sub in categoryData) {
      const subTitle = document.createElement("h3");
      subTitle.textContent = sub;
      content.appendChild(subTitle);

      const container = document.createElement("div");
      for (let site of categoryData[sub]) {
        const div = document.createElement("a");
        div.className = "site";
        div.href = site.url;
        div.target = "_blank";
        div.textContent = site.name;
        container.appendChild(div);
      }
      content.appendChild(container);
    }
  }

  function showSearchResults(query) {
    content.innerHTML = `<h2>搜索结果: ${query}</h2>`;
    const results = [];
    for (let category in data) {
      for (let sub in data[category]) {
        for (let site of data[category][sub]) {
          if (site.name.toLowerCase().includes(query)) {
            results.push(site);
          }
        }
      }
    }
    if (results.length === 0) {
      content.innerHTML += "<p>未找到相关站点</p>";
      return;
    }
    const container = document.createElement("div");
    for (let site of results) {
      const div = document.createElement("a");
      div.className = "site";
      div.href = site.url;
      div.target = "_blank";
      div.textContent = site.name;
      container.appendChild(div);
    }
    content.appendChild(container);
  }
}

loadData();
