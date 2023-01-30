<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCurrentSectionToPracticeResults extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('practice_results', function (Blueprint $table) {
            $table->integer('current_section')->nullable()->after('status');
            $table->integer('current_item')->nullable()->after('current_section');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('practice_results', function (Blueprint $table) {
            //
        });
    }
}
