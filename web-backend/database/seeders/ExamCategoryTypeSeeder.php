<?php

namespace Database\Seeders;

use App\Models\ExamCategory;
use App\Models\ExamType;
use Illuminate\Database\Seeder;

class ExamCategoryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $c1 = ExamCategory::create(['name' => 'Engineering']);
        $c2 = ExamCategory::create(['name' => 'Medical']);
        $c3 = ExamCategory::create(['name' => 'Bank']);

        $t1 = ExamType::create(['exam_category_id' => $c1->id, 'name' => 'JEE Mains']);
        $t2 = ExamType::create(['exam_category_id' => $c1->id, 'name' => 'JEE Advance']);
    }
}
