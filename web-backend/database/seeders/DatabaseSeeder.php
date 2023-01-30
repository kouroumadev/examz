<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class, //*
            InstituteSeeder::class,
            BranchSeeder::class,
            BatchSeeder::class,
            UserSeeder::class, //* (Superadmin only)
            ExamCategoryTypeSeeder::class, //*
            TopicSeeder::class,
        ]);
    }
}
