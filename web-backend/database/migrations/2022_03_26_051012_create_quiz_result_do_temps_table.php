<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizResultDoTempsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_result_do_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_result_dtemp_id')->constrained('quiz_result_dtemps')->onDelete('cascade');
            $table->foreignId('quiz_option_id')->constrained('quiz_options')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_result_do_temps');
    }
}
