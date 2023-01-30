<?php

namespace Database\Seeders;

use App\Models\Institute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InstituteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Institute::create([
            'name' => 'Unesa',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'establishment_year' => '1950',
            'pin_code' => '8080',
        ]);

        Institute::create([
            'name' => 'Um',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'establishment_year' => '1959',
            'pin_code' => '9090',
        ]);
    }
}
