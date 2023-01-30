<?php

namespace Database\Seeders;

use App\Models\Batch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Batch::create([
            'institute_id' => 1,
            'name' => 'First',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => 1,
            'name' => 'Second',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => 1,
            'name' => 'Third',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => 2,
            'name' => 'One',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => 2,
            'name' => 'Two',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => 2,
            'name' => 'Three',
            'code' => '0909',
        ]);
    }
}
