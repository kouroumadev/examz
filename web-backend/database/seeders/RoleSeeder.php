<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(['name' => 'SA']);
        Role::create(['name' => 'IA']);
        Role::create(['name' => 'OT']);
        Role::create(['name' => 'STF']);
        Role::create(['name' => 'ST']);
    }
}
