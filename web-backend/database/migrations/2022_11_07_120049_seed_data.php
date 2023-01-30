<?php

use App\Models\User;
use App\Models\Batch;
use App\Models\Topic;
use App\Models\Branch;
use App\Models\ExamType;
use App\Models\Institute;
use Illuminate\Support\Str;
use App\Models\ExamCategory;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Migrations\Migration;


class SeedData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->createRole();
        $this->createInstituteAndBranch();
        $this->createTopic();
        $this->createExamCategory();
        $this->createUsers();
    }

    private function createExamCategory()
    {
        $c1 = ExamCategory::create(['name' => 'Engineering']);
        $c2 = ExamCategory::create(['name' => 'Medical']);
        $c3 = ExamCategory::create(['name' => 'Bank']);
        ExamType::create(['exam_category_id' => $c1->id, 'name' => 'JEE Mains']);
        ExamType::create(['exam_category_id' => $c1->id, 'name' => 'JEE Advance']);
    }

    private function createRole()
    {
        Role::create(['name' => 'SA']);
        Role::create(['name' => 'IA']);
        Role::create(['name' => 'OT']);
        Role::create(['name' => 'STF']);
        Role::create(['name' => 'ST']);
    }


    private function createTopic()
    {
        Topic::create(['name' => 'Basic Algebra']);
        Topic::create(['name' => 'Calculus']);
    }

    private function createUsers()
    {
        $u1 = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@examz.pro',
            'password' => Hash::make('9502e615'),
            'gender' => 'MALE',
        ]);
        $u1->assignRole('SA');
        $u1->markEmailAsVerified();

        $u2 = User::create([
            'institute_id' => 1,
            'employee_id' => 'EMP-0101',
            'name' => 'Institute Admin 1',
            'email' => 'ia1@examz.pro',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u2->assignRole('IA');
        $u2->markEmailAsVerified();

        $u3 = User::create([
            'institute_id' => 2,
            'employee_id' => 'EMP-0101',
            'name' => 'Institute Admin 2',
            'email' => 'ia2@examz.pro',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u3->assignRole('IA');
        $u3->markEmailAsVerified();

        $u4 = User::create([
            'institute_id' => 1,
            'employee_id' => 'EMP-0201',
            'name' => 'Staff 1',
            'email' => 'stf1@examz.pro',
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
            'email' => 'stf2@examz.pro',
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
            'email' => 'st1@examz.pro',
            'phone' => '+917382339157',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u7->assignRole('ST');
        $u7->markEmailAsVerified();

        $u8 = User::create([
            'name' => 'Student 2',
            'email' => 'st2@examz.pro',
            'phone' => '+917050607607',
            'password' => Hash::make('password'),
            'gender' => 'MALE',
        ]);
        $u8->assignRole('ST');
        $u8->markEmailAsVerified();
    }

    private function createInstituteAndBranch()
    {

        $i1 = Institute::create([
            'name' => 'Unesa',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'establishment_year' => '1950',
            'pin_code' => '8080',
        ]);

        $i2 = Institute::create([
            'name' => 'Um',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'establishment_year' => '1959',
            'pin_code' => '9090',
        ]);

        Branch::create([
            'institute_id' => $i1->id,
            'name' => 'Ketintang',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'approve',
        ]);

        Branch::create([
            'institute_id' => $i1->id,
            'name' => 'Lidah Wetan',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'pending',
        ]);

        Branch::create([
            'institute_id' => $i1->id,
            'name' => 'Royal',
            'address' => 'Surabaya',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Port Blair',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'reject',
        ]);

        Branch::create([
            'institute_id' => $i2->id,
            'name' => 'Batu',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Bamboo Flat',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'approve',
        ]);

        Branch::create([
            'institute_id' => $i2->id,
            'name' => 'Blimbing',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Nicobar',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'pending',
        ]);

        Branch::create([
            'institute_id' => $i2->id,
            'name' => 'Pujon',
            'address' => 'Malang',
            'state' => 'Andaman and Nicobar Islands',
            'city' => 'Port Blair',
            'email' => Str::random(10) . '@gmail.com',
            'landline_number' => '8080',
            'phone' => '085657889900',
            'pin_code' => '0909',
            'status' => 'reject',
        ]);

        Batch::create([
            'institute_id' => $i1->id,
            'name' => 'First',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => $i1->id,
            'name' => 'Second',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => $i1->id,
            'name' => 'Third',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => $i2->id,
            'name' => 'One',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => $i2->id,
            'name' => 'Two',
            'code' => '0909',
        ]);

        Batch::create([
            'institute_id' => $i2->id,
            'name' => 'Three',
            'code' => '0909',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
