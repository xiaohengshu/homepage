const SERVER_URL = "https://vc-moe-202301.azurewebsites.net"

var $table = $('#table')
var $favList = $('#fav_list')
var $seed = $('#seed')
var $pageSize = $('#page-size')
var $result = $('#result')
var $drawSettings = $('#draw-settings')
var $drawBtn = $('#draw-btn')
var $drawBtnDiv = $('#draw-btn-div')
var $resultTextDiv = $('#result-text-div')
var $resultTableDiv = $('#result-table-div')


function toBiliLink(avid) {
    return `https://www.bilibili.com/video/av${avid}/`
}

function idFormatter(value, row, index) {
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

function genResult(data) {
    var pageData = $table.bootstrapTable('getData', { useCurrentPage: true })
    if (pageData.length) {
        var pageNum = $table.bootstrapTable('getOptions').pageNumber
        var text = "【第" + (pageNum) + "组】\n"
        pageData.forEach((item, index) => {
            text += `${(index + 1)} ${toBiliLink(item.id)}\n`
        });
        text = text.substring(0, text.length - 1)
        $result.val(text)
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

function loadFavVideoData() {
    var fav_id = $favList.val()
    var seed = $seed.val()
    var pageSize = $pageSize.val()
    var shuffle = true

    if (!seed || seed.length === 0) {
        alert("请输入分组种子！")
        $seed.focus()
        return;
    }

    if (!pageSize || pageSize.length === 0) {
        alert("请输入分组大小！")
        $pageSize.focus()
        return;
    }

    if (String(parseInt(pageSize)) !== pageSize || parseInt(pageSize) <= 0) {
        alert("请输入正确的分组大小！")
        $pageSize.val("")
        $pageSize.focus()
        return;
    }

    $drawSettings.attr("disabled", true)
    $drawBtnDiv.hide()
    $resultTextDiv.show()
    $resultTableDiv.show()

    var url = `${SERVER_URL}/fav/${fav_id}?page_size=${pageSize}&shuffle=${shuffle}&seed=${seed}`

    $table.bootstrapTable('refreshOptions', {
        url: url,
        pageSize: pageSize,
        pageList: [pageSize, 'All']
    })
}

function tableLoadError(status, jqXHR) {
    alert(`获取抽签结果错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(status)}`);
}

$(function () {
    const url = `${SERVER_URL}/fav`;
    $.ajax(url)
        .done(loadFavData)
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert(`获取收藏夹列表错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(textStatus)}\nerror: ${JSON.stringify(errorThrown)}`);
        })
    $drawBtn.click(loadFavVideoData)
    $table.bootstrapTable({
        onPostBody: genResult,
        onLoadError: tableLoadError
    })
})