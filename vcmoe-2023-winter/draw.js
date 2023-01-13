const SERVER_URL = "https://vc-moe-202301.azurewebsites.net"

var $table = $('#table')
var $favList = $('#fav_list')
var $seed = $('#seed')
var $pageSize = $('#page-size')
var $result = $('#result')

function changeTableUrl() {
    var shuffle = true
    var seed = $seed.val()
    var fav_id = $favList.val()
    var url = `${SERVER_URL}/fav/${fav_id}?shuffle=${shuffle}&seed=${seed}`
    $table.bootstrapTable('refreshOptions', {
        url: url
    })
}

function changeTablePageSize() {
    var pageSize = $pageSize.val()
    $table.bootstrapTable('refreshOptions', {
        pageSize: pageSize,
        pageList: [pageSize, 'All']
    })
}

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
    var pageNum = $table.bootstrapTable('getOptions').pageNumber
    var text = "【第" + (pageNum) + "组】\n"
    pageData.forEach((item, index) => {
        text += `${(index + 1)} ${toBiliLink(item.id)}\n`
    });
    text = text.substring(0, text.length - 1)
    $result.val(text)
}

function loadFavData(result) {
    $.each(result, function (i, field) {
        $favList.append($('<option>', {
            value: field["id"],
            text: field["title"]
        }));
    });
    $favList.change()
}

function loadFavVideoData() {
    $table.bootstrapTable({
        onPostBody: genResult
    })
    $seed.change(changeTableUrl)
    $pageSize.change(changeTablePageSize)
    changeTableUrl()
    changeTablePageSize()
}

$(function () {
    const url = `${SERVER_URL}/fav`;
    $.getJSON(url, loadFavData)
    $favList.change(loadFavVideoData)
})