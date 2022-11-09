import request from '@/utils/request'

export function AddMemberRequest(data) {
  return request({
    url: '/face/adduser',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function MultiAddMemberRequest(data) {
  return request({
    url: '/face/multiadduser',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function FetchMultiAddMemberLogsRequest(params) {
  return request({
    url: '/face/fetchmultiaddmemberlogs',
    method: 'get',
    params: params
  })
}

export function EditMemberRequest(data) {
  return request({
    url: '/face/edituser',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function RepeatRecognizeById(id) {
  return request({
    url: '/face/repeatrecognize',
    method: 'post',
    params: { id: id }
  })
}

export function DeleteMemberById(data) {
  return request({
    url: '/face/deleteuser',
    method: 'post',
    params: data
  })
}

export function RepeatDeleteMemberById(id) {
  return request({
    url: '/face/repeatdeleteuser',
    method: 'post',
    params: { id: id }
  })
}

export function RepeatChangeRoomById(id) {
  return request({
    url: '/face/repeatchangeroom',
    method: 'post',
    params: { id: id }
  })
}

export function IgnoreOldData(id) {
  return request({
    url: '/face/ignoreolddata',
    method: 'post',
    params: { id: id }
  })
}

export function DeleteOldDataById(id) {
  return request({
    url: '/face/deleteolddata',
    method: 'post',
    params: { id: id }
  })
}

export function RepeatAddFaceById(id) {
  return request({
    url: '/face/repeataddface',
    method: 'post',
    params: { id: id }
  })
}

export function CancelDeleteMemberById(id) {
  return request({
    url: '/face/canceldeleteuser',
    method: 'post',
    params: { id: id }
  })
}

export function CancelChangeRoom(id) {
  return request({
    url: '/face/cancelchangeroom',
    method: 'post',
    params: { id: id }
  })
}

export function ForceDeleteMemberById(para) {
  return request({
    url: '/face/forcedeleteuser',
    method: 'post',
    params: para
  })
}

export function FetchMemberList(query) {
  return request({
    url: '/face/personlist',
    method: 'get',
    params: query
  })
}

export function FetchStatisticsList(query) {
  return request({
    url: '/face/statisticslist',
    method: 'get',
    params: query
  })
}

export function FetchSyslogsList(query) {
  return request({
    url: '/face/systemlogs',
    method: 'get',
    params: query
  })
}

export function FetchClientsLogsList(query) {
  return request({
    url: '/face/clientslogs',
    method: 'get',
    params: query
  })
}

export function EditPwd(adminaccount, oldpwd, newpwd, token) {
  return request({
    url: '/user/editpwd',
    method: 'post',
    params: { adminname: adminaccount, oldpwd: oldpwd, newpwd: newpwd, token: token }
  })
}

export function FetchDeviceList(query) {
  return request({
    url: '/face/devices',
    method: 'get',
    params: query
  })
}

export function AddDevice(data) {
  return request({
    url: '/face/adddevice',
    method: 'post',
    params: data
  })
}

export function EditDevice(data) {
  return request({
    url: '/face/editdevice',
    method: 'post',
    params: data
  })
}

export function DeleteDevice(id, token) {
  return request({
    url: '/face/deletedevice',
    method: 'post',
    params: { deviceid: id, token: token }
  })
}

export function BindDevice(id, roomid, hotelid, token) {
  return request({
    url: '/face/bind',
    method: 'post',
    params: { deviceid: id, roomid: roomid, hotelid: hotelid, token: token }
  })
}

export function UnbindDevice(id, token) {
  return request({
    url: '/face/unbind',
    method: 'post',
    params: { deviceid: id, token: token }
  })
}

export function FetchHotelList(query) {
  return request({
    url: '/face/hotellist',
    method: 'get',
    params: query
  })
}

export function AddHotel(data) {
  return request({
    url: '/face/addhotel',
    method: 'post',
    params: data
  })
}

export function EditHotel(data) {
  return request({
    url: '/face/edithotel',
    method: 'post',
    params: data
  })
}

export function FetchAllRoomList(id) {
  return request({
    url: '/face/queryroomlistbyhotelid',
    method: 'get',
    params: { hotelid: id }
  })
}

export function FetchRoomList(query) {
  return request({
    url: '/face/roomlist',
    method: 'get',
    params: query
  })
}

export function AddRoom(data) {
  return request({
    url: '/face/addroom',
    method: 'post',
    params: data
  })
}

export function DeleteRoomById(data) {
  return request({
    url: '/face/deleteroom',
    method: 'post',
    params: data
  })
}

export function FetchEditorList(query) {
  return request({
    url: '/face/editorlist',
    method: 'get',
    params: query
  })
}

export function AddEditor(data) {
  return request({
    url: '/face/addeditor',
    method: 'post',
    params: data
  })
}

export function EditEditor(data) {
  return request({
    url: '/face/editeditor',
    method: 'post',
    params: data
  })
}
export function DisableEditor(id) {
  return request({
    url: '/face/disableeditor',
    method: 'post',
    params: { id: id }
  })
}

export function EnableEditor(id) {
  return request({
    url: '/face/enableeditor',
    method: 'post',
    params: { id: id }
  })
}

export function EditEditorPwd(data) {
  return request({
    url: '/face/editeditorpwd',
    method: 'post',
    params: data
  })
}

export function Repeat(data) {
  return request({
    url: '/face/repeat',
    method: 'post',
    params: data
  })
}
