<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamConfiguration;
use Illuminate\Support\Str;

class ExamConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ExamConfiguration::create([
        //     'exam_category_id' => '1',
        //     'description' => '',
        //     'duration' => json_encode([
        //         'type' => 'total',
        //         'value' => 180
        //     ]),
        //     'type' => 'DURATION',
        //     'consent' => 'This is consent from Engineering',
        //     'data' => json_encode(["value" => "50"], JSON_UNESCAPED_SLASHES),
        //     'instruction' => json_encode([
        //         ["data" => "Instruction Engineering 1"],
        //         ["data" => "Instruction Engineering 2"],
        //         ["data" => "Instruction Engineering 3"]
        //     ], JSON_UNESCAPED_SLASHES)
        // ]);




        ExamConfiguration::create([
            'exam_category_id' => '1',
            'exam_type_id' => '1',
            'data' =>[
                'instruction' => 'Follow all the steps',
                'consent' => 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations',
                'duration' => [
                    "type" => "total",
                    "value" => 1000000
                ],
                'sections' => [
                    [
                        'name' => 'Mathmaticss',
                        'max_question' => '3',
                        // 'instruction' => 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations',
                        'questions' => [
                            "number" => 3,
                            "mark" => 10,
                            "negative_mark" => 5,
                            "correct_answer" => 4
                        ],
                    ],
                    [
                        'name' => 'Physics',
                        'max_question' => '2',
                        // 'descriptions' => 'desc of phy',
                        'questions' => [
                            "number" => 5,
                            "mark" => 15,
                            "negative_mark" => 5,
                            "correct_answer" => 5
                        ],
                    ],
                    [
                        'name' => 'Chemestry',
                        'max_question' => '1',
                        // 'descriptions' => 'desc of chems',
                        'questions' => [
                            "number" => 4,
                            "mark" => 12,
                            "negative_mark" => 7,
                            "correct_answer" => 4
                        ],
                    ],

                ],

            ]
        ]);

        ExamConfiguration::create([
            'exam_category_id' => '2',
            'exam_type_id' => '0',
            'data' =>[

                'instruction' => 'This is an instruction',
                'consent' => 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations',
                'duration' => [
                    "type" => "total",
                    "value" => 500000
                ],
                'sections' => [
                    [
                        'name' => 'Mathematics',
                        'max_question' => '3',
                        // 'descriptions' => 'desc of Mathematics',
                        'questions' => [
                            "number" => 5,
                            "mark" => 10,
                            "negative_mark" => 1,
                            "correct_answer" => 3
                        ],
                    ],
                    [
                        'name' => 'Physics',
                        'max_question' => '2',
                        // 'descriptions' => 'desc of phy',
                        'questions' => [
                            "number" => 3,
                            "mark" => 20,
                            "negative_mark" => 1,
                            "correct_answer" => 5
                        ],
                    ],
                    [
                        'name' => 'Chemestry',
                        'max_question' => '1',
                        // 'descriptions' => 'desc of chems',
                        'questions' => [
                            "number" => 2,
                            "mark" => 30,
                            "negative_mark" => 2,
                            "correct_answer" => 3
                        ],
                    ],

                ],

            ]
        ]);

        ExamConfiguration::create([
            'exam_category_id' => '3',
            'exam_type_id' => '0',
            'data' =>[

                'instruction' => 'this an instruction',
                'consent' => 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations',
                'duration' => [
                    "type" => "total",
                    "value" => 900000
                ],
                'sections' => [
                    [
                        'name' => 'Mathematics',
                        'max_question' => '3',
                        // 'descriptions' => 'desc of Mathematics',
                        'questions' => [
                            "number" => 5,
                            "mark" => 10,
                            "negative_mark" => 2,
                            "correct_answer" => 6
                        ],
                    ],
                    [
                        'name' => 'Physics',
                        'max_question' => '2',
                        // 'descriptions' => 'desc of phy',
                        'questions' => [
                            "number" => 3,
                            "mark" => 50,
                            "negative_mark" => 1,
                            "correct_answer" => 5
                        ],
                    ],
                    [
                        'name' => 'Chemestry',
                        'max_question' => '1',
                        // 'descriptions' => 'desc of chems',
                        'questions' => [
                            "number" => 5,
                            "mark" => 25,
                            "negative_mark" => 2,
                            "correct_answer" => 3
                        ],
                    ],

                ],

            ]
        ]);



    }
}
