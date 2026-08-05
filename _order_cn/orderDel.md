---
title: 单笔撤单
position_number: 3
type: delete
split: -------------------------------------
description: /v4/order/{orderId}
parameters:
    -
        name: orderId
        type: number
        mandatory: true
        default:
        description: 订单ID
        ranges:
content_markdown: >-

left_code_blocks:
    -
        code_block: |-
            public String orderDel(){


            }
        title: Java
        language: java
    -
        code_block:
        title: Python
        language: python
right_code_blocks:
    -
        code_block: |-
                {
                  "rc": 0,
                  "mc": "string",
                  "ma": [
                    {}
                  ],
                  "result": {
                  "cancelId":"650466676217149120",
                  "orderId":"650169915598632640"
                 }
                }
        title: Response
        language: json
---
