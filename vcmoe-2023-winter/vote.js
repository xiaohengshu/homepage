const SERVER_URL = "https://vc-moe-202301.azurewebsites.net"

var $electionList = $('#election_list')
var $result = $('#result')
var $vote = $('#vote')

function toBiliLink(avid) {
    return `https://www.bilibili.com/video/av${avid}/`
}

function idFormatter(value, row, index) {
    var avid = row.avid
    var bililink = toBiliLink(avid)
    return `<a class="link" target="_blank" href="${bililink}">${avid}</a>`
}

function ctimeFormatter(value, row, index) {
    var t = new Date(row.ctime * 1000);
    var month = t.getMonth() + 1
    var date = t.getDate()
    var hours = t.getHours()
    var minute = t.getMinutes()
    month = String(month).padStart(2, "0")
    date = String(date).padStart(2, "0")
    hours = String(hours).padStart(2, "0")
    minute = String(minute).padStart(2, "0")
    return month + "-" + date + " " + hours + ":" + minute
}

function loadElections(result) {
    $electionList.html("")
    $.each(result, function (i, field) {
        $electionList.append($('<option>', {
            value: field.rpid,
            text: `${field.title}`
        }));
    });
    $electionList.attr("disabled", false)
    $electionList.change()
}

function loadDrawResult() {
    rpid = $electionList.val()

    var url = `${SERVER_URL}/elections/${rpid}/votes`
    $vote.bootstrapTable('refreshOptions', {
        url: url,
    })

    var url = `${SERVER_URL}/elections/${rpid}/result`
    $result.bootstrapTable('refreshOptions', {
        url: url,
    })
}

function tableLoadError(status, jqXHR) {
    alert(`获取投票结果错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\nstatus: ${JSON.stringify(status)}`);
}

$(function () {
    $electionList.change(loadDrawResult)
    $vote.bootstrapTable({
        onLoadError: tableLoadError
    })
    $result.bootstrapTable({
        onLoadError: tableLoadError
    })

    const url = `${SERVER_URL}/elections`;
    $.ajax(url)
    .done(loadElections)
    .fail(function( jqXHR, textStatus, errorThrown ) {
        alert(`获取投票列表错误！请刷新页面重试 :(\njqXHR: ${JSON.stringify(jqXHR)}\ntextStatus: ${JSON.stringify(textStatus)}\nerrorThrown: ${JSON.stringify(errorThrown)}`);
    })
})