# 闯关答题 Api 一览（1.0）

## BaseUrl: 哈尔滨服务器地址

### Api

1. 获取题目:

    - URL: /getquestions/:level
    - Method: **GET**
    - URL Param:

      - level=**[Integer]**

    - Success Response:
      - StatusCode: 200
      - { quetionsInfo: q_example文档里面的json数据}
    - Error Response:
      - StatusCode: 500
      - { errorMessage: 错误原因string }

1. 提交答题结果:
    - 记录每一关的得分，最终汇总
    - URL: /postAnswer
    - Method: **POST**
    - Data Param:

          {
              userId: string,
              levelNo(第几关): int,
              questionSeriesNo(套题序号): int,
              answers: Array
          }

    - Success Response:
      - StatusCode: 200
      - { result: 'success'}
    - Error Response:
      - StatusCode: 500
      - { errorMessage: 错误原因string }

1. 排行信息:

    - URL: /result
    - Method: **GET**
    - URL Param:

      - userId= **[string]**
      - type= **(time|notime) [string]**

    - Success Response:
      - StatusCode: 200
      - data

            {
              userResult:Array(所有关数的成绩),
              userName:string,
              topTenResult:[
                {
                  userName:string,
                  result: int(总分)
                }
              ]
            }
    - Error Response:
      - StatusCode: 500
      - { errorMessage: 错误原因string }
