const SERVER_URL = "https://vc-moe-202301.azurewebsites.net"


var $drawSettings = $('#draw-settings')

var $drawBtn = $('#draw-btn')

var $favList = $('#fav-list')
var $name = $('#name')
var $seed = $('#seed')
var $size = $('#size')
var $final = $('#final')

var $table = $('#table')

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

function loadFavList(result) {
    $favList.html("")

    $favList.append($('<option>', {
        value: "",
        text: "-请选择-"
    }));

    $.each(result, function (i, field) {
        $favList.append($('<option>', {
            value: field.id,
            text: `${field.title} (${field.media_count})`
        }));
    });
    $favList.attr("disabled", false)
    $favList.change()
}

function loadFavVideos() {
    $drawSettings.attr("disabled", true);
    $favList.attr("disabled", true);

    var fav_id = $favList.val()

    if (!fav_id) {
        $table.bootstrapTable('refreshOptions', {
            data: [],
            url: null
        })
        $favList.attr("disabled", false);
        return;
    }

    var url = `${SERVER_URL}/favorites/${fav_id}`


    $table.bootstrapTable('refreshOptions', {
        url: url,
    })
}

function tableRefresh() {
    var url = $table.bootstrapTable('getOptions').url

    if (url) {
        $drawSettings.attr("disabled", true);
        $favList.attr("disabled", true);
    }
}

function loadDrawResult() {
    var favId = $favList.val()
    var name = $name.val()
    var seed = $seed.val()
    var size = $size.val()
    var final = $final.val()

    if (!favId) {
        alert("请选择收藏夹！")
        $favList.focus()
        return;
    }

    if (!name || name.length === 0) {
        alert("请输入名称！")
        $name.focus()
        return;
    }

    if (!size || size.length === 0) {
        alert("请输入每组候选数！")
        $size.focus()
        return;
    }

    if (String(parseInt(size)) !== size || parseInt(size) <= 0) {
        alert("请输入正确的每组候选数！")
        $size.val("")
        $size.focus()
        return;
    }

    if (!final || final.length === 0) {
        alert("请输入每组晋级数！")
        $final.focus()
        return;
    }

    if (String(parseInt(final)) !== final || parseInt(final) <= 0) {
        alert("请输入正确的每组晋级数！")
        $final.val("")
        $final.focus()
        return;
    }

    if (parseInt(final) > parseInt(size)) {
        alert("每组晋级数不得超过每组候选数！")
        $final.val("")
        $final.focus()
        return;
    }

    if (!seed || seed.length === 0) {
        alert("请输入分组种子！")
        $seed.focus()
        return;
    }



    window.location.href = `./group.html?favId=${encodeURIComponent(favId
    )}&name=${encodeURIComponent(name)}&seed=${encodeURIComponent(seed)}&size=${encodeURIComponent(size)}&final=${encodeURIComponent(final)}`;
}

function tableLoadError(status, jqXHR) {
    $favList.attr("disabled", false);

    alert(`获取抽签结果错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(status)}`);
}

function tableLoadSuccess() {
    $favList.attr("disabled", false);
    $drawSettings.attr("disabled", false);
}

$(function () {
    $favList.change(loadFavVideos)
    $drawBtn.click(loadDrawResult)

    $table.bootstrapTable({
        onLoadError: tableLoadError,
        onLoadSuccess: tableLoadSuccess,
        onRefresh: tableRefresh,
    })

    const url = `${SERVER_URL}/favorites`;
    $.ajax(url)
        .done(loadFavList)
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert(`获取收藏夹列表错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(textStatus)}\nerror: ${JSON.stringify(errorThrown)}`);
        })
})