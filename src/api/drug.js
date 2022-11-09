import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/user/userlist',
    method: 'get',
    params: query
  })
}
export function openUser(id) {
  return request({
    url: '/user/openuser',
    method: 'get',
    params: { userid: id }
  })
}
export function closeUser(id) {
  return request({
    url: '/user/closeuser',
    method: 'get',
    params: { userid: id }
  })
}
export function fetchCodes(query) {
  return request({
    url: '/user/fetchcodes',
    method: 'get',
    params: query
  })
}
export function deleteCodeById(id) {
  return request({
    url: '/user/deletecodebyid',
    method: 'get',
    params: { codeid: id }
  })
}
export function fetchCategoryList(query) {
  return request({
    url: '/link/linkcategorylist',
    method: 'get',
    params: query
  })
}
export function editLinkCategory(query) {
  return request({
    url: '/link/linkcategoryedit',
    method: 'post',
    params: query
  })
}
export function addLinkCategory(query) {
  return request({
    url: '/link/linkcategoryadd',
    method: 'post',
    params: query
  })
}
export function deleteLinkCategoryById(id) {
  return request({
    url: '/link/linkcategorydelete',
    method: 'post',
    params: { linkcategoryid: id }
  })
}
export function fetchLinkListByCatId(id) {
  return request({
    url: '/link/fetchlinklistbycatid',
    method: 'get',
    params: { linkcategoryid: id }
  })
}
export function editLink(query) {
  return request({
    url: '/link/editlink',
    method: 'post',
    params: query
  })
}
export function addLink(query) {
  return request({
    url: '/link/addlink',
    method: 'post',
    params: query
  })
}
export function deleteLinkById(id) {
  return request({
    url: '/link/deletelink',
    method: 'post',
    params: { linkid: id }
  })
}
export function openLinkById(id) {
  return request({
    url: '/link/openlink',
    method: 'post',
    params: { linkid: id }
  })
}
export function closeLinkById(id) {
  return request({
    url: '/link/closelink',
    method: 'post',
    params: { linkid: id }
  })
}
export function fetchDrugs(query) {
  return request({
    url: '/drug/getsearchdrugs',
    method: 'post',
    params: query
  })
}
export function fetchDrugsForAll(query) {
  return request({
    url: '/drug/getsearchdrugsforall',
    method: 'post',
    params: query
  })
}
export function fetchResidualDrugs(query) {
  return request({
    url: '/drug/getsearchresidualdrugs',
    method: 'post',
    params: query
  })
}
export function fetchToxicDrugs(query) {
  return request({
    url: '/drug/getsearchtoxiceffectdrugs',
    method: 'post',
    params: query
  })
}
export function fetchDrugCategoryList() {
  return request({
    url: '/drug/fetchdrugcategorylist',
    method: 'get',
    params: { }
  })
}
export function fetchAnimalCategoryList() {
  return request({
    url: '/drug/fetchanimalcategorylist',
    method: 'get',
    params: { }
  })
}
export function fetchTargetCategoryList() {
  return request({
    url: '/drug/fetchtargetcategorylist',
    method: 'get',
    params: { }
  })
}
export function addDrugCategory(name) {
  return request({
    url: '/drug/adddrugcategory',
    method: 'post',
    params: { drugcategoryname: name }
  })
}
export function addAnimalCategory(name) {
  return request({
    url: '/drug/addanimalcategory',
    method: 'post',
    params: { animalcategoryname: name }
  })
}
export function addTargetCategory(name) {
  return request({
    url: '/drug/addtargetcategory',
    method: 'post',
    params: { targettissuecategoryname: name }
  })
}

export function editDrugCategory(query) {
  return request({
    url: '/drug/editdrugcategory',
    method: 'post',
    params: query
  })
}
export function editAnimalCategory(query) {
  return request({
    url: '/drug/editanimalcategory',
    method: 'post',
    params: query
  })
}
export function editTargetCategory(query) {
  return request({
    url: '/drug/edittargetcategory',
    method: 'post',
    params: query
  })
}
export function uploadImage(data) {
  return request({
    url: '/drug/uploadimage',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
export function addOrUpdateDrugbaseInfo(query) {
  return request({
    url: '/drug/addorupdatedrugbaseinfo',
    method: 'post',
    params: query
  })
}
export function deleteDrugBaseInfo(id) {
  return request({
    url: '/drug/deletedrugbaseinfo',
    method: 'post',
    params: { drugid: id }
  })
}
export function addOrUpdateResidualInfo(query) {
  return request({
    url: '/drug/addorupdateresidualinfo',
    method: 'post',
    params: query
  })
}
export function deleteResidualDrug(id) {
  return request({
    url: '/drug/deleteresidualdrug',
    method: 'post',
    params: { drugid: id }
  })
}
export function addOrUpdateToxicInfo(query) {
  return request({
    url: '/drug/addorupdatetoxicinfo',
    method: 'post',
    params: query
  })
}
export function deleteToxicInfo(id) {
  return request({
    url: '/drug/deletetoxicinfo',
    method: 'post',
    params: { drugid: id }
  })
}
export function fetchDrugDetail(id) {
  return request({
    url: '/drug/fetchdrugdetail',
    method: 'post',
    params: { drugid: id }
  })
}
export function fetchDetectMethodList(id) {
  return request({
    url: '/drug/fetchdetectmethodlist',
    method: 'post',
    params: { drugid: id }
  })
}
export function fetchResidualLimitList(id) {
  return request({
    url: '/drug/fetchresiduallimitlist',
    method: 'post',
    params: { drugid: id }
  })
}
export function deleteDetectMethod(id) {
  return request({
    url: '/drug/deletedetectmethod',
    method: 'post',
    params: { drugdetectionmethodid: id }
  })
}
export function deleteResidualLimit(id) {
  return request({
    url: '/drug/deleteresiduallimit',
    method: 'post',
    params: { residualtargetid: id }
  })
}
export function addDetectMethod(query) {
  return request({
    url: '/drug/adddetectmethod',
    method: 'post',
    params: query
  })
}
export function addResidualLimit(query) {
  return request({
    url: '/drug/addresiduallimit',
    method: 'post',
    params: query
  })
}

