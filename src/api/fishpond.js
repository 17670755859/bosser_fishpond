import request from '@/utils/request'

export function FetchPonds(params) {
  return request({
    url: '/pond/fetchponds',
    method: 'get',
    params: params
  })
}

export function FetchPondsInGroup(params) {
  return request({
    url: '/pond/fetchpondsingroup',
    method: 'get',
    params: params
  })
}

export function FetchPondsForUserId(params) {
  return request({
    url: '/pond/fetchpondsforuserid',
    method: 'get',
    params: params
  })
}

export function FetchPondGroups(params) {
  return request({
    url: '/pond/fetchpondgroups',
    method: 'get',
    params: params
  })
}

export function FetchDevices(params) {
  return request({
    url: '/pond/fetchdevices',
    method: 'get',
    params: params
  })
}

export function FetchDevicesInPond(params) {
  return request({
    url: '/pond/fetchdevicesinpond',
    method: 'get',
    params: params
  })
}

export function FetchDevicesInDeviceGroup(params) {
  return request({
    url: '/pond/fetchdevicesingroup',
    method: 'get',
    params: params
  })
}

export function FetchDevicesInController(params) {
  return request({
    url: '/pond/fetchdevicesincontroller',
    method: 'get',
    params: params
  })
}

export function FetchDeviceGroups(params) {
  return request({
    url: '/pond/fetchdevicegroups',
    method: 'get',
    params: params
  })
}

export function FetchControllers(params) {
  return request({
    url: '/pond/fetchdevicecontrollers',
    method: 'get',
    params: params
  })
}

export function FetchFishers(params) {
  return request({
    url: '/pond/fetchfishermans',
    method: 'get',
    params: params
  })
}

export function FetchEmployees(params) {
  return request({
    url: '/pond/fetchemployees',
    method: 'get',
    params: params
  })
}

export function FetchEmployeesForBossId(params) {
  return request({
    url: '/pond/fetchemployeesforbossid',
    method: 'get',
    params: params
  })
}

export function FetchPondGroupsForEmployee(params) {
  return request({
    url: '/pond/fetchpondgroupsforemployee',
    method: 'get',
    params: params
  })
}

export function AddBanner(data) {
  return request({
    url: '/pond/addbanner',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function AddhelpVideo(data) {
  return request({
    url: '/pond/addhelpvideo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function AddhelpFile(data) {
  return request({
    url: '/pond/addhelpfile',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function AddbkImage(data) {
  return request({
    url: '/pond/addbkimage',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function UpdatebkImage(data) {
  return request({
    url: '/pond/updatebkimage',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function UpdateBanner(data) {
  return request({
    url: '/pond/updatebanner',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function UpdatehelpVideo(data) {
  return request({
    url: '/pond/updatehelpvideo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function UpdatehelpFile(data) {
  return request({
    url: '/pond/updatehelpfile',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function FetchBanners(params) {
  return request({
    url: '/pond/fetchbanners',
    method: 'get',
    params: params
  })
}

export function GethelpVideo(params) {
  return request({
    url: '/pond/gethelpvideo',
    method: 'get',
    params: params
  })
}

export function GethelPfile(params) {
  return request({
    url: '/pond/gethelpfile',
    method: 'get',
    params: params
  })
}


export function GetbkImage(params) {
  return request({
    url: '/pond/getbkimage',
    method: 'get',
    params: params
  })
}

export function DeleteBannerById(params) {
  return request({
    url: '/pond/delbanner',
    method: 'post',
    params: params
  })
}

export function RemovehelpVideo(params) {
  return request({
    url: '/pond/removehelpvideo',
    method: 'post',
    params: params
  })
}

export function RemovehelpFile(params) {
  return request({
    url: '/pond/removehelpfile',
    method: 'post',
    params: params
  })
}

export function RemovebkImage(params) {
  return request({
    url: '/pond/removebkimage',
    method: 'post',
    params: params
  })
}

export function AddAdmin(params) {
  return request({
    url: '/pond/addadmin',
    method: 'post',
    params: params
  })
}

export function DisabledAdmin(params) {
  return request({
    url: '/pond/disabledadmin',
    method: 'post',
    params: params
  })
}

export function ResetAdminPwd(params) {
  return request({
    url: '/pond/resetadminpwd',
    method: 'post',
    params: params
  })
}

export function FetchAdmins(params) {
  return request({
    url: '/pond/fetchadmins',
    method: 'get',
    params: params
  })
}

export function FetchFeedbacks(params) {
  return request({
    url: '/pond/fetchfeedbacks',
    method: 'get',
    params: params
  })
}

export function FetchAfterSales(params) {
  return request({
    url: '/pond/fetchaftersales',
    method: 'get',
    params: params
  })
}

export function FetchCompanyInfo(token) {
  return request({
    url: '/pond/fetchcompanyinfo',
    method: 'get',
    params: { token: token }
  })
}

export function SaveCompanyInfo(data) {
  return request({
    url: '/pond/savecompanyinfo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function EditPwd(adminaccount, oldpwd, newpwd, token) {
  return request({
    url: '/pond/user/editpwd',
    method: 'post',
    params: { adminname: adminaccount, oldpwd: oldpwd, newpwd: newpwd, token: token }
  })
}

export function FetchCameras(params) {
  return request({
    url: '/pond/fetchwatchdogs',
    method: 'get',
    params: params
  })
}

export function AddNews(data) {
  return request({
    url: '/pond/addnews',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function Editnews(data) {
  return request({
    url: '/pond/editnews',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function EditDeviceInfo(data) {
  return request({
    url: '/pond/editdeviceinfo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function EditPondInfo(data) {
  return request({
    url: '/pond/editpondinfo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function FetchNews(params) {
  return request({
    url: '/pond/fetchnews',
    method: 'get',
    params: params
  })
}

export function DeleteNewsById(params) {
  return request({
    url: '/pond/delnews',
    method: 'post',
    params: params
  })
}

export function DeleteFeedBackById(params) {
  return request({
    url: '/pond/delfeedback',
    method: 'post',
    params: params
  })
}

export function DeleteWatchDogById(params) {
  return request({
    url: '/pond/delwatchdog',
    method: 'post',
    params: params
  })
}

export function DeleteFishHealthById(params) {
  return request({
    url: '/pond/delfishhealthrecord',
    method: 'post',
    params: params
  })
}

export function DeleteAnnualEstimateRecord(params) {
  return request({
    url: '/pond/delannualestimaterecord',
    method: 'post',
    params: params
  })
}

export function DeleteAnnualBenefitRecord(params) {
  return request({
    url: '/pond/delannualbenefitrecord',
    method: 'post',
    params: params
  })
}

export function DeleteSellRecord(params) {
  return request({
    url: '/pond/delsellrecord',
    method: 'post',
    params: params
  })
}

export function DeleteOutputRecord(params) {
  return request({
    url: '/pond/deloutputrecord',
    method: 'post',
    params: params
  })
}

export function DeleteDiseaseRecord(params) {
  return request({
    url: '/pond/deldiseaserecord',
    method: 'post',
    params: params
  })
}

export function DeleteWaterQualityRecord(params) {
  return request({
    url: '/pond/delwaterqualityrecord',
    method: 'post',
    params: params
  })
}

export function DeleteChangeWaterRecordById(params) {
  return request({
    url: '/pond/delchangewaterrecord',
    method: 'post',
    params: params
  })
}

export function DeleteFishMedicineRecordById(params) {
  return request({
    url: '/pond/delfishmedicinerecord',
    method: 'post',
    params: params
  })
}

export function DeleteFishPutinRecordById(params) {
  return request({
    url: '/pond/delfishputinrecord',
    method: 'post',
    params: params
  })
}

export function DeleteAfterSaleById(params) {
  return request({
    url: '/pond/delaftersale',
    method: 'post',
    params: params
  })
}

export function FetchWarnings(params) {
  return request({
    url: '/pond/fetchwarnings',
    method: 'get',
    params: params
  })
}

export function DeleteWarningById(params) {
  return request({
    url: '/pond/delwarning',
    method: 'post',
    params: params
  })
}

export function FetchLogs(params) {
  return request({
    url: '/pond/fetchlogs',
    method: 'get',
    params: params
  })
}

export function AddCase(data) {
  return request({
    url: '/pond/addcase',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function FetchCases(params) {
  return request({
    url: '/pond/fetchcases',
    method: 'get',
    params: params
  })
}

export function DeleteCaseById(params) {
  return request({
    url: '/pond/delcase',
    method: 'post',
    params: params
  })
}

export function FetchFishPutinRecords(params) {
  return request({
    url: '/pond/fetchfishputinrecords',
    method: 'get',
    params: params
  })
}

export function FetchFishMedicineRecords(params) {
  return request({
    url: '/pond/fetchfishmedicinerecords',
    method: 'get',
    params: params
  })
}

export function FetchChangeWaterRecords(params) {
  return request({
    url: '/pond/fetchchangewaterrecords',
    method: 'get',
    params: params
  })
}

export function FetchWaterQualityRecords(params) {
  return request({
    url: '/pond/fetchwaterqualityrecords',
    method: 'get',
    params: params
  })
}

export function FetchDiseaseRecords(params) {
  return request({
    url: '/pond/fetchdiseaserecords',
    method: 'get',
    params: params
  })
}

export function FetchOutputRecords(params) {
  return request({
    url: '/pond/fetchoutputrecords',
    method: 'get',
    params: params
  })
}

export function FetchSellRecords(params) {
  return request({
    url: '/pond/fetchsellrecords',
    method: 'get',
    params: params
  })
}

export function FetchAnnualBenefitRecords(params) {
  return request({
    url: '/pond/fetchannualbenefitrecords',
    method: 'get',
    params: params
  })
}

export function FetchAnnualEstimateRecords(params) {
  return request({
    url: '/pond/fetchannualestimaterecords',
    method: 'get',
    params: params
  })
}

export function fetchFishHealthRecords(params) {
  return request({
    url: '/pond/fetchfishhealthrecords',
    method: 'get',
    params: params
  })
}

export function FetchElectricityStatisticsByToday(params) {
  return request({
    url: '/pond/fetchelectricitystatisticsbytoday',
    method: 'get',
    params: params
  })
}

export function FetchElectricityStatisticsByWeek(params) {
  return request({
    url: '/pond/fetchelectricitystatisticsbythisweek',
    method: 'get',
    params: params
  })
}

export function FetchElectricityStatisticsByThisMonth(params) {
  return request({
    url: '/pond/fetchelectricitystatisticsbythismonth',
    method: 'get',
    params: params
  })
}

export function FetchElectricityStatisticsBySpace(params) {
  return request({
    url: '/pond/fetchelectricitystatisticsbyspace',
    method: 'get',
    params: params
  })
}

export function DeleteFishpondById(params) {
  return request({
    url: '/pond/delfishpond',
    method: 'post',
    params: params
  })
}

export function DeleteDeviceById(params) {
  return request({
    url: '/pond/deldevice',
    method: 'post',
    params: params
  })
}

export function DeleteFishpondGroupById(params) {
  return request({
    url: '/pond/delfishpondgroup',
    method: 'post',
    params: params
  })
}

export function DeleteFishpondFromGroupById(params) {
  return request({
    url: '/pond/delfishpondfromgroup',
    method: 'post',
    params: params
  })
}

export function DeleteDeviceGroupById(params) {
  return request({
    url: '/pond/deldevicegroup',
    method: 'post',
    params: params
  })
}

export function DeleteDeviceFromGroupById(params) {
  return request({
    url: '/pond/deldevicefromdevicegroup',
    method: 'post',
    params: params
  })
}

export function DeleteControllerById(params) {
  return request({
    url: '/pond/delcontroller',
    method: 'post',
    params: params
  })
}

export function Addbreedingconfig(params) {
  return request({
    url: '/pond/addbreedingconfig',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}

export function Delbreedingconfig(params) {
  return request({
    url: '/pond/delbreedingconfig',
    method: 'post',
    params: params
  })
}

export function Getbreedingconfig(params) {
  return request({
    url: '/pond/getbreedingconfig',
    method: 'GET',
    params: params
  })
}

export function Updatebreedingconfig(params) {
  return request({
    url: '/pond/updatebreedingconfig',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}

export function UploadMedia(params) {
  return request({
    url: '/pond/uploadmedia',
    method: 'post',
    data: params
  })
}

export function GetDevicestats(params) {
  return request({
    url: '/pond/getdevicestats',
    method: 'get',
    data: params
  })
}
