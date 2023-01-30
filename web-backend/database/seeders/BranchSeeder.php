<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Branch::create([
            'institute_id' => 1,
            'name' => 'Ketintang',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'approve',
        ]);

        Branch::create([
            'institute_id' => 1,
            'name' => 'Lidah Wetan',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'pending',
        ]);

        Branch::create([
            'institute_id' => 1,
            'name' => 'Royal',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Port Blair',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'reject',
        ]);

        Branch::create([
            'institute_id' => 2,
            'name' => 'Batu',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'approve',
        ]);

        Branch::create([
            'institute_id' => 2,
            'name' => 'Blimbing',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'pending',
        ]);

        Branch::create([
            'institute_id' => 2,
            'name' => 'Pujon',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Port Blair',
            'email' => Str::random(10).'@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'reject',
        ]);
    }
}
