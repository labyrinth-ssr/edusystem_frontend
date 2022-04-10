const Mock = require('mockjs')

// const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random

// mock新闻数据，包括新闻标题title、内容content、创建时间createdTime
function produceCoursesData() {
  let coursesList = []
  for (let i = 0; i < 500; i++) {
    let newcoursesObject = {
       id: 'ENG001.01' ,//课程编号.id，.id为两位，例如：ENG001.01',
       number: 'ENG001', //课程编号，3位字母表示类型，三位数字表示编号，例如：ENG001',
       name: '大学英语3', //课程名称',
       point: 3,//学分',
       classes_per_week: 3, //周课时数（学时）',
       teacher_id: '20000001' ,//任课老师的id',
       class_time: '2-3,2-4,2-5,3-1,3-2', //' //上课的节次列表，格式为：\"2-3,2-4,2-5,3-1,3-2\"，表示周二3-5节、周三1-2节，周次和节次用“-“区隔，节次为数字（1-14），节次间用英文逗号隔开',
       classroom_id: 'H3101', //上课的教室id',
       max_student: 50,//最大学生数量，不得少于10人，若缺省或非法，则认为无人数上限',
       introduction: '基础大学英语课程' ,//课程简介',
       department: '外语学院'
    }
    coursesList.push(newcoursesObject)
  }
  return coursesList
}

function producerequestData() {
  let requestList = []
  request1={
    requester_id: '20000001', //'发起请求者的id',
    request_class: 'AddCourseRequest', //'请求类的名，必须是Request（如AddCourseRequest）',
    request_content: {
      class_time: "2-3,2-4,2-5,3-1,3-2",
      classes_per_week: 3,
      classroom_id: "H3101",
      department: "外语学院",
      introduction: "基础大学英语课程",
      max_student: '50',
      name: "大学英语3",
      number: "ENG001",
      point: '3',
  }, //'处理类的内容的json形式',
    handler_id: 'root',//'处理者（管理员）的id',
    handle_result: 'processing', //'\"approved\",\"rejected\",\"processing\"',
    }
    requestList.push(request1)
    request2={
      requester_id: '20000001', //'发起请求者的id',
      request_class: 'EditCourseRequest', //'请求类的名，必须是Request（如AddCourseRequest）',
      request_content: {
        class_time: "2-3,2-4,2-5,3-1,3-2",
        classes_per_week: 3,
        classroom_id: "H3101",
        department: "外语学院",
        introduction: "基础大学英语课程",
        max_student: '50',
        name: "大学英语3",
        number: "ENG001",
        point: '3',
        teacher_id:'20000001'
    }, //'处理类的内容的json形式',
      handler_id: 'root',//'处理者（管理员）的id',
      handle_result: 'processing', //'\"approved\",\"rejected\",\"processing\"',
      }
    requestList.push(request2)
 
  return requestList
}

function produceClasstableData (){
  var classtablelist=[]

  for (let i=0;i<7;i++){
    let classtable={
      'h3101':['','高数','高数','线代','线代','','','','','','','','',''],
      'h3102':['','','','线代','线代','大英','大英','','','','','','','']
    }
    classtablelist.push(classtable)
  }
  return classtablelist
}

// 拦截该url，就可以返回newsList
Mock.mock('http://localhost:5000/courses', produceCoursesData) 
Mock.mock('http://localhost:5000/requests', producerequestData) 
Mock.mock('http://localhost:5000/classtable', produceClasstableData) 

