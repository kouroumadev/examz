<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //* Must
        $u1 = User::create([
            'name' => 'Super Admin',
            'email' => 'sa@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u1->assignRole('SA');
        $u1->markEmailAsVerified();

        $u2 = User::create([
            'institute_id' => 1,
            'employee_id' => 'EMP-0101',
            'name' => 'Institute Admin 1',
            'email' => 'ia1@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u2->assignRole('IA');
        $u2->markEmailAsVerified();

        $u3 = User::create([
            'institute_id' => 2,
            'employee_id' => 'EMP-0101',
            'name' => 'Institute Admin 2',
            'email' => 'ia2@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u3->assignRole('IA');
        $u3->markEmailAsVerified();

        $u4 = User::create([
            'institute_id' => 1,
            'employee_id' => 'EMP-0201',
            'name' => 'Staff 1',
            'email' => 'stf1@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u4->assignRole('STF');
        $u4->markEmailAsVerified();

        $u5 = User::create([
            'institute_id' => 1,
            'branch_id' => 1,
            'employee_id' => 'EMP-0202',
            'name' => 'Staff 2',
            'email' => 'stf2@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u5->assignRole('STF');
        $u5->markEmailAsVerified();

        $u6 = User::create([
            'name' => 'Operator Team',
            'email' => 'ot@gmail.com',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u6->assignRole('OT');
        $u6->markEmailAsVerified();

        $u7 = User::create([
            'name' => 'Student 1',
            'email' => 'st1@gmail.com',
            'phone' => '082234897777',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u7->assignRole('ST');
        $u7->markEmailAsVerified();

        $u8 = User::create([
            'name' => 'Student 2',
            'email' => 'st2@gmail.com',
            'phone' => '082234897778',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u8->assignRole('ST');
        $u8->markEmailAsVerified();
    }
}
