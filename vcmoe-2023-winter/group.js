const SERVER_URL = "https://vc-moe-202301.azurewebsites.net"

var $table = $('#table')
var $favList = $('#fav-list')
var $seed = $('#seed')
var $size = $('#page-size')
var $result = $('#result')
var $drawSettings = $('#draw-settings')
var $drawBtn = $('#draw-btn')
var $drawBtnDiv = $('#draw-btn-div')
var $resultTextDiv = $('#result-text-div')
var $resultTableDiv = $('#result-table-div')
var $addFav = $('#add-fav')
var $name = $('#name')
var $addFavTextDiv = $('#add-fav-text-div')
function actionFormatter(value, row, index, field) {
    return `<button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addFavModal"
    data-bs-fav-title="${row.id}"><i class="bi bi-star-fill"></i></button>`
}

function toBiliLink(avid) {
    return `https://www.bilibili.com/video/av${avid}/`
}

function avidFormatter(value, row, index) {
    var avid = row.id
    var bililink = toBiliLink(avid)
    return `<a class="link" target="_blank" href="${bililink}">${avid}</a>`
}

function ctimeFormatter(value, row, index) {
    var t = new Date(row.ctime * 1000);
    var year = t.getFullYear()
    var month = t.getMonth() + 1
    var date = t.getDate()
    year = String(year).padStart(4, "0")
    month = String(month).padStart(2, "0")
    date = String(date).padStart(2, "0")
    return year + "-" + month + "-" + date
}
function add_fav_script(title, list) {
    return `var fav_title=${JSON.stringify(title)};var aid_list=${JSON.stringify(list.map(function (item) { return item.id; }))};var cookie=document.cookie;var csrf = cookie.replace(/(?:(?:^|.*;\\s*)bili_jct\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1");var CREATE_FAV="https://api.bilibili.com/x/v3/fav/folder/add";var ADD_FAV="https://api.bilibili.com/x/v3/fav/resource/deal";function add_fav(avid,fav_id){$.ajax({type:'POST',url:ADD_FAV,data:{rid:avid,type:2,add_media_ids:fav_id,csrf:csrf},async:false,xhrFields:{withCredentials:true},dataType:"json",})}function create_fav(fav_title){$.ajax({type:'POST',url:CREATE_FAV,data:{title:fav_title,csrf:csrf},async:false,xhrFields:{withCredentials:true},dataType:"json",}).success((result)=>{fav_id=result.data.id})}if(csrf){alert("即将创建收藏夹\\n按确定后请等待约"+500*(aid_list.length)/1000+"秒\\n请不要操作页面，完成后会有弹窗提示");create_fav(fav_title,aid_list);for(i=0;i<aid_list.length;i++){aid=aid_list[i];setTimeout(add_fav,500*i,aid,fav_id)}setTimeout("alert('收藏夹创建完成')",500*(aid_list.length))}else{alert("csrf错误！请登录后访问https://space.bilibili.com/")}`
}
function genResult(data) {
    var pageData = $table.bootstrapTable('getData', { useCurrentPage: true })
    var all = $table.bootstrapTable('getData', { unfiltered: true }).length
    if (pageData.length && pageData.length > 0 && pageData.length < all) {
        var group_id = pageData[0]._group_id
        var text = `【${drawName}-${group_id}组】${pageData.length}进${final}\n`
        pageData.forEach((item, index) => {
            text += `${(index + 1)} ${toBiliLink(item.id)}\n`
        });
        text += `每人最多投${final}票，格式：`
        for (var i = 1; i <= final; i++) {
            text += `${i} `
        }
        text += "\n截止时间为第二天14:00"
        $result.val(text)
        $addFav.val(add_fav_script(`${drawName}-${group_id}组`, pageData))
    } else {
        $result.val(`请在表格中选择分组`)
        $addFav.val("请在表格中选择分组")
    }
}

function loadFavData(result) {
    $favList.html("")
    $.each(result, function (i, field) {
        $favList.append($('<option>', {
            value: field.id,
            text: `${field.title} (${field.media_count})`
        }));
    });
    $drawSettings.attr("disabled", false)
}

function detailFormatter(index, row) {
    var html = []
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    })
    return html.join('')
}
function tableLoadError(status, jqXHR) {
    alert(`获取抽签结果错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(status)}`);
}
const parsedUrl = new URL(window.location.href)

var favId = parsedUrl.searchParams.get("favId")
var drawName = parsedUrl.searchParams.get("name")
var seed = parsedUrl.searchParams.get("seed")
var size = parsedUrl.searchParams.get("size")
var final = parsedUrl.searchParams.get("final")


$(function () {
    if (!favId) {
        alert("请选择收藏夹！")
        window.location.href = "./draw.html"
        return;
    }

    if (!drawName || drawName.length === 0) {
        alert("请输入名称！")
        window.location.href = "./draw.html"
        return;
    }

    if (!seed || seed.length === 0) {
        alert("请输入分组种子！")
        window.location.href = "./draw.html"
        return;
    }

    if (!size || size.length === 0) {
        alert("请输入每组候选数！")
        window.location.href = "./draw.html"
        return;
    }

    if (String(parseInt(size)) !== size || parseInt(size) <= 0) {
        alert("请输入正确的每组候选数！")
        window.location.href = "./draw.html"
        return;
    }

    if (!final || final.length === 0) {
        alert("请输入每组晋级数！")
        window.location.href = "./draw.html"
        return;
    }

    if (String(parseInt(final)) !== final || parseInt(final) <= 0) {
        alert("请输入正确的每组晋级数！")
        window.location.href = "./draw.html"
        return;
    }

    if (parseInt(final) > parseInt(size)) {
        alert("每组晋级数不得超过每组候选数！")
        window.location.href = "./draw.html"
        return;
    }

    $name.text(drawName)

    var url = `${SERVER_URL}/favorites/${encodeURIComponent(favId
    )}/groups?perfer_size=${encodeURIComponent(size)}&shuffle_seed=${encodeURIComponent(seed)}`

    $table.bootstrapTable({
        onPostBody: genResult,
        onLoadError: tableLoadError,
        onRefresh: genResult,
    })

    $table.bootstrapTable('refreshOptions', {
        url: url,
    })
})